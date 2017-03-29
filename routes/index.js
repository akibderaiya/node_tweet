const express = require('express');
const multer = require('multer');
const path = require('path');
const DB = require('../helpers/db');
const nodemailer = require('nodemailer');
var crypto = require("crypto");

let transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {
        user: 'akib@improwised.com',
        pass: 'akib@improwised'
    },

});

const upload = multer({ dest: path.resolve(__dirname, '../public/images/profile/') });
const uploadTweet = multer({ dest: path.resolve(__dirname, '../public/images/tweet/') });
const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.session.mail) {
    return res.redirect('/login');
  }
  return res.redirect('/login');

  const query = DB.builder()
   .select()
   .function('NOW()')
   .toParam();

  DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
      return;
    }

    res.render('index', {
      title: `Time from the database is ${results.rows[0].now}`,
    });
  });
});

router.get('/login', (req, res, next) => {
  res.render('login', {
    title: 'Login',
  });
});

router.post('/forgot', (req, res, next) => {
  let email = req.body.emailforgot;
  const query = DB.builder()
    .select()
    .from('registration')
    .where('email = ?', email)
    .toParam();
  // console.log(query);
  DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
      return;
    }
    // console.log(results.rows);
    if(results.rows.length > 0) {
      let id = crypto.randomBytes(10).toString('hex');

      const query1 = DB.builder()
        .update()
        .table('registration')
        .set('forgot_string', id)
        .where('email = ?', email)
        .toParam();
      DB.executeQuery(query1, (error, results) => {
        if (error) {
          console.log(error);
          next(error);
          return;
        }
      });

      let link = '<a href="http://localhost:3000/forgotpas/?m='+email+'&&random='+id+'">Click Here For Change Your Account Password</a>';
      let maildata = {
        from: 'abcd@gmail', // sender address
        to: email, // list of receivers
        subject: 'Change Your Account Password', // Subject line
        html: link, // html body
      };

      // send mail with defined transport object
      transporter.sendMail( maildata, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Message %s sent: %s', info.messageId, info.response);
        }
      });
      res.send('1');
    } else {
      res.send('0');
    }

  })
});

//
router.get('/forgotpas', (req, res, next) => {
  var user_email = req.param('m');
  var token = req.param('random');
  const query = DB.builder()
    .select()
    .from("registration")
    .where("email = ? AND forgot_string= ? ", user_email, token)
    .toParam();
   DB.executeQuery(query, (error, results) => {
    if (error) {
      console.log(error);
      next(error);
      return;
    }

    if(results.rows.length > 0){
      return res.render('forgot',{
        title: 'Forgot Password',
        msgchange: 'Change Your Password',
        email: token,
      });
    } else {
      return res.render('Login',{
        title: 'Login',
        msgforgote: 'Sorry Your Password Forgot Link Wrong',
      })
    }
  });
});
//

router.get('/register', (req, res, next) => {
  res.render('register', {
    title: 'Register',
    // msg: 'Sorry Your Activation Link Wrong',
  });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {

      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
});

router.get('/follow', (req, res, next) => {
  if (!req.session.mail) {
    return res.redirect('/login');
  }

  const query1 = DB.builder()
    .select()
    .from('registration')
    .where('user_id != ? AND user_id NOT IN ?', req.session.user_id, DB.builder().select().field('follower_id').from('follow').where('follow_id = ?', req.session.user_id))
    .toParam();
  DB.executeQuery(query1, (error, results) => {
    if (error) {
      next(error);
      return;
    }

    res.render('follow', {
      title: 'Follow This People',
      data: results.rows,
    });
  });
});

router.get('/follow/:userid', (req, res, next) => {
  if (!req.session.mail) {
    return res.redirect('/login');
  }

  const follower = req.params.userid;
  const follow = req.session.user_id;
  const query = DB.builder()
    .insert()
    .into('follow')
    .set('follower_id', follower)
    .set('follow_id', follow)
    .toParam();

  DB.executeQuery(query, (error, results) => {
    if (error) {
      console.log(error);
      next(error);
      return;
    }

    res.redirect('/follow');
  });
});

router.get('/unfollow/:userid', (req, res, next) => {
  if (!req.session.mail) {
    return res.redirect('/home');
  }
  // console.log(req.params.userid);
  const follower = req.params.userid;
  const query = DB.builder()
    .delete()
    .from('follow')
    .where('id = ?', follower)
    .toParam();

  DB.executeQuery(query, (error, results) => {
    if (error) {
      console.log(error);
      next(error);
      return;
    }

    res.redirect('/profile');
  });
});

// view profile start
router.get('/viewprofile/:userid', (req, res, next) => {
  // console.log(req.params.userid);
  // return false;
  if (!req.session.mail) {
    return res.redirect('/home');
  }

  let follow = '';
  let tweet = '';
  const query = DB.builder()
    .select()
    .field('fname')
    .field('lname')
    .field('tweet')
    .field('profile')
    .field('post_image')
    .field('timest')
    .from('registration', 'r')
    .join(DB.builder().select().from('user_tweet'), 'u', 'r.user_id = u.user_id')
    .where('r.activation_number = ?', req.params.userid)
    .order('timest', false)
    .toParam();

  DB.executeQuery(query, (error, tweets) => {
    if (error) {
      next(error);
      return;
    }

    const query1 = DB.builder()
    .select()
    .field('user_id')
    .from('registration')
    .where('activation_number = ?', req.params.userid)
    .toParam();

    DB.executeQuery(query1, (error, userid) => {
    if (error) {
      next(error);
      return;
    }
    // console.log(userid.rows);

    const query2 = DB.builder()
      .select()
      .field('fname')
      .field('lname')
      .field('profile')
      .field('follower_id')
      .field('id')
      .from('registration', 'r')
      .join(DB.builder().select().from('follow'), 'f', 'r.user_id = f.follower_id')
      .where('f.follow_id = ?', userid.rows[0].user_id)
      .toParam();
    // console.log(query2);


    DB.executeQuery(query2, (error1, followers) => {
      if (error1) {
        next(error1);
        return;
      }

      const profileQuery = DB.builder()
        .select()
        .from('registration')
        .where('activation_number = ?', req.params.userid)
        .toParam();

      DB.executeQuery(profileQuery, (error2, profile) => {
        if (error2) {
          next(error2);
          return;
        }

        // console.log(followers.rows);

        follow = followers.rows;
        tweet = tweets.rows;
        const name = profile.rows[0].fname + profile.rows[0].lname;
        const email = profile.rows[0].email;
        const profilePhoto = profile.rows[0].profile;

        res.render('viewprofile', {
          title: 'Profile',
          tweet1: tweet,
          follow1: follow,
          profileData: profile.rows[0],
          name,
          email,
          profile: profilePhoto,
        });
      });
    });
  });
  });
});

// view profile end



router.get('/profile', (req, res, next) => {
  if (!req.session.mail) {
    return res.redirect('/login');
    return false;
  }

  let follow = '';
  let tweet = '';
  const query = DB.builder()
    .select()
    .field('fname')
    .field('lname')
    .field('tweet')
    .field('profile')
    .field('post_image')
    .field('timest')
    .from('registration', 'r')
    .join(DB.builder().select().from('user_tweet'), 'u', 'r.user_id = u.user_id')
    .where('u.user_id = ?', req.session.user_id)
    .order('timest', false)
    .toParam();

  DB.executeQuery(query, (error, tweets) => {
    if (error) {
      next(error);
      return;
    }

    const query1 = DB.builder()
      .select()
      .field('fname')
      .field('lname')
      .field('profile')
      .field('follower_id')
      .field('id')
      .from('registration', 'r')
      .join(DB.builder().select().from('follow'), 'f', 'r.user_id = f.follower_id')
      .where('follow_id = ?', req.session.user_id)
      .toParam();

    DB.executeQuery(query1, (error1, followers) => {
      if (error1) {
        next(error1);
        return;
      }

      const profileQuery = DB.builder()
        .select()
        .from('registration')
        .where('user_id = ?', req.session.user_id)
        .toParam();

      DB.executeQuery(profileQuery, (error2, profile) => {
        if (error2) {
          next(error2);
          return;
        }

        // console.log(profile.rows);

        follow = followers.rows;
        tweet = tweets.rows;
        const name = profile.rows[0].fname + profile.rows[0].lname;
        const email = profile.rows[0].email;
        const profilePhoto = profile.rows[0].profile;

        res.render('profile', {
          title: 'Profile',
          tweet1: tweet,
          follow1: follow,
          profileData: profile.rows[0],
          name,
          email,
          profile: profilePhoto,
        });
      });
    });
  });
});

router.get('/home', (req, res, next) => {
  if (!req.session.mail) {
    return res.redirect('/login');
  }

  const query = DB.builder()
    .select()
    .field('fname')
    .field('lname')
    .field('tweet')
    .field('activation_number')
    .field('profile')
    .field('timest')
    .field('post_image')
    .from('registration', 'r')
    .join(DB.builder().select().from('user_tweet'), 'u', 'r.user_id = u.user_id')
    .where('u.user_id IN ? OR u.user_id= ? ', (DB.builder().select().field('follower_id').from('follow').where('follow_id = ?', req.session.user_id)), req.session.user_id)
    .order('timest', false)
    .toParam();

  DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
      return;
    }
    res.render('home', {
      title: 'Home',
      data: results.rows,
    });
  });
});

router.get('/active', (req, res, next) => {
  var user_email = req.param('m');
  var token = req.param('random');
  // console.log("user email => ", user_email);
  // console.log("user Random Number  => ", token);
  const query = DB.builder()
    .select()
    .from("registration")
    .where("email = ? AND activation_number= ? ", user_email, token)
    .toParam();
   DB.executeQuery(query, (error, results) => {
    if (error) {
      console.log(error);
      next(error);
      return;
    }

    if(results.rows.length > 0){
      const query1 = DB.builder()
        .update()
        .table('registration')
        .set('activation_status', '1')
        .where('email = ?', user_email)
        .toParam();
      DB.executeQuery(query1, (error, results) => {
        if (error) {
          console.log(error);
          next(error);
          return;
        }
      });
      // console.log(query1);

      return res.render('login',{
        title: 'Login',
        msglogin: 'Your Activation Successfully Done. Now You CAn Login',
      });
    } else {
      return res.render('Login',{
        title: 'Login',
        msg: 'Sorry Your Activation Link Wrong',
      })
    }
  });
});

router.post('/', upload.single('profile'), (req, res, next) => {
  let id = crypto.randomBytes(10).toString('hex');

  req.checkBody('fname', 'Username is required').notEmpty();
  req.check('phone', 'Mobile No is required').notEmpty();
  req.check('phone', 'Mobile No is Numeric Accept Only').isInt();
  req.check('lname', 'Email is required').notEmpty();
  req.check('cemail', 'Email is not valid').isEmail();
  req.check('password', 'Password is required').notEmpty();
  req.checkBody('cpassword', 'Confirm Password do not match With Password').equals(req.body.password);
  var errors = req.validationErrors();
  // console.log(errors);

  if (errors) {
    return res.render('register', {
      title: 'Register',
      errors,
    });
  } else {

    let photo = '';

    if (req.file) {
      photo = req.file.filename;
    } else {
      photo = 'default.png';
    }

    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.cemail;
    const pas = req.body.password;
    const phone = req.body.phone;

    // console.log("normal processing here");

    const query = DB.builder()
      .insert()
      .into('registration')
      .set('fname', fname)
      .set('lname', lname)
      .set('email', email)
      .set('password', pas)
      .set('phone_no', phone)
      .set('profile', photo)
      .set('activation_number', id)
      .toParam();

    // console.log(query);

    DB.executeQuery(query, (error, results) => {
      if (error) {
        console.log(error);
        next(error);
        return;
      }
      let link = '<a href="http://localhost:3000/active/?m='+email+'&&random='+id+'">Click Here For Active Your Account</a>';

      let maildata = {
        from: 'abcd@gmail', // sender address
        to: email, // list of receivers
        subject: 'Active Your Account', // Subject line
        html: link, // html body
      };

      // send mail with defined transport object
      transporter.sendMail( maildata, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Message %s sent: %s', info.messageId, info.response);
        }
      });
      res.redirect('/home');
    });
  }
});

router.post('/log', (req, res, next) => {
  const email = req.body.email;
  const pas = req.body.pas;
  const query = DB.builder()
    .select()
    .from('registration')
    .where('email= ? AND password=?', email, pas)
    .toParam();

  DB.executeQuery(query, (error, results) => {
    if (error) {
      console.log(error);
      next(error);
      return;
    }

    if(results.rows) {
      if (results.rows.length > 0) {
        const query1 = DB.builder()
          .select()
          .from('registration')
          .where('email= ? AND activation_status=?', email,1)
          .toParam();

        DB.executeQuery(query1, (error1, check) => {
          if (error1) {
            console.log(error1);
            next(error1);
            return;
          }
          // console.log(check.rows);

          if(check.rows.length > 0){
            let sess = '';
            sess = req.session;
            req.session.mail = email;
            req.session.user_id = results.rows[0].user_id;

            res.redirect('/home');
          } else {
            res.render('login',{
              title: 'Login',
              active: 'Sorry! Your Email Not Active Yet.! Please Active First.'
            });
          };
        });
      } else {
        res.render('login',{
          title: 'Login',
          failed: 'Sorry! Your Email Or Password Wrong. Please Try Again With Correct Login Detail'
        });
      }
    }

  });
});


router.post('/ProfileUpload', upload.single('profile'), (req, res, next) => {
  if (!req.session.mail) {
    return res.redirect('/login');
  }

  let photo = '';

  if (!req.session.mail) {
    return res.redirect('/home');
  }
  let query = '';
  if (req.file) {
    photo = req.file.filename;
    query = DB.builder()
    .update()
    .table('registration')
    .set('fname', req.body.fname)
    .set('lname', req.body.lname)
    .set('phone_no', req.body.phone)
    .set('profile', photo)
    .where('user_id = ?', req.session.user_id)
    .toParam();
  }
  else{
    query = DB.builder()
    .update()
    .table('registration')
    .set('fname', req.body.fname)
    .set('lname', req.body.lname)
    .set('phone_no', req.body.phone)
    .where('user_id = ?', req.session.user_id)
    .toParam();


  }


  // console.log(query);
  //return false;

  DB.executeQuery(query, (error, results) => {
    if (error) {
      console.log(error);
      next(error);
      return;
    }
    res.redirect('/profile');
  });
});

router.post('/tweet', uploadTweet.single('profile'), (req, res, next) => {
  if (!req.session.mail) {
    return res.redirect('/home');
  }

  const msg = req.body.ccomment;
  const userid = req.session.user_id;
  let photo = '';
  if (req.file) {
    photo = req.file.filename;
  } else {
    photo = '';
  }

  const query = DB.builder()
    .insert()
    .into('user_tweet')
    .set('user_id', userid)
    .set('tweet', msg)
    .set('post_image', photo)
    .toParam();

  DB.executeQuery(query, (error, results) => {
    if (error) {
      console.log(error);
      next(error);
      return;
    }
    res.redirect('/home');
  });
});

router.post('/forgotPassword', uploadTweet.single('profile'), (req, res, next) => {

  const email = req.body.usermail;
  const password = req.body.pas;

  const query = DB.builder()
    .update()
    .table('registration')
    .set('password', password)
    .where('forgot_string = ?', email)
    .toParam();
  // console.log(query);
  DB.executeQuery(query, (error, results) => {
    if (error) {
      console.log(error);
      next(error);
      return;
    }

    res.redirect('/login');
  });
});

module.exports = router;
