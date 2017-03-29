--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 9.6.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: follow; Type: TABLE; Schema: public; Owner: akib
--

CREATE TABLE follow (
    id integer NOT NULL,
    follower_id integer,
    follow_id integer
);


ALTER TABLE follow OWNER TO akib;

--
-- Name: follow_id_seq; Type: SEQUENCE; Schema: public; Owner: akib
--

CREATE SEQUENCE follow_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE follow_id_seq OWNER TO akib;

--
-- Name: follow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: akib
--

ALTER SEQUENCE follow_id_seq OWNED BY follow.id;


--
-- Name: registration; Type: TABLE; Schema: public; Owner: akib
--

CREATE TABLE registration (
    user_id integer NOT NULL,
    fname text,
    email text,
    lname text,
    password text,
    profile text,
    phone_no bigint
);


ALTER TABLE registration OWNER TO akib;

--
-- Name: registration_id_seq; Type: SEQUENCE; Schema: public; Owner: akib
--

CREATE SEQUENCE registration_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE registration_id_seq OWNER TO akib;

--
-- Name: registration_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: akib
--

ALTER SEQUENCE registration_id_seq OWNED BY registration.user_id;


--
-- Name: user_tweet; Type: TABLE; Schema: public; Owner: akib
--

CREATE TABLE user_tweet (
    id integer NOT NULL,
    user_id integer,
    tweet text,
    timest timestamp without time zone DEFAULT now(),
    post_image text
);


ALTER TABLE user_tweet OWNER TO akib;

--
-- Name: user_tweet_id_seq; Type: SEQUENCE; Schema: public; Owner: akib
--

CREATE SEQUENCE user_tweet_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_tweet_id_seq OWNER TO akib;

--
-- Name: user_tweet_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: akib
--

ALTER SEQUENCE user_tweet_id_seq OWNED BY user_tweet.id;


--
-- Name: follow id; Type: DEFAULT; Schema: public; Owner: akib
--

ALTER TABLE ONLY follow ALTER COLUMN id SET DEFAULT nextval('follow_id_seq'::regclass);


--
-- Name: registration user_id; Type: DEFAULT; Schema: public; Owner: akib
--

ALTER TABLE ONLY registration ALTER COLUMN user_id SET DEFAULT nextval('registration_id_seq'::regclass);


--
-- Name: user_tweet id; Type: DEFAULT; Schema: public; Owner: akib
--

ALTER TABLE ONLY user_tweet ALTER COLUMN id SET DEFAULT nextval('user_tweet_id_seq'::regclass);


--
-- Data for Name: follow; Type: TABLE DATA; Schema: public; Owner: akib
--

COPY follow (id, follower_id, follow_id) FROM stdin;
16	19	1
\.


--
-- Name: follow_id_seq; Type: SEQUENCE SET; Schema: public; Owner: akib
--

SELECT pg_catalog.setval('follow_id_seq', 16, true);


--
-- Data for Name: registration; Type: TABLE DATA; Schema: public; Owner: akib
--

COPY registration (user_id, fname, email, lname, password, profile, phone_no) FROM stdin;
19	Akib	akibderaiya12@gmail.com	Deraiya	akib	default.png	973734772
21	a	abcdds@dg	a	a	5818577e8ee31a2f7dcacd1ce7af2ee6	9737334772
22	abcd	abcd@fgaa	a	a	a15d9d2547b8fc652a7e2136e5072b8f	9737334772
1	Tohsif	akibderaiya123@gmail.com	Shrimali	akibderaiya	f4cb041205dbd806b047166723aba4e6	9924024610
\.


--
-- Name: registration_id_seq; Type: SEQUENCE SET; Schema: public; Owner: akib
--

SELECT pg_catalog.setval('registration_id_seq', 24, true);


--
-- Data for Name: user_tweet; Type: TABLE DATA; Schema: public; Owner: akib
--

COPY user_tweet (id, user_id, tweet, timest, post_image) FROM stdin;
6	1	dfgdsfgrt	2017-01-27 11:05:54.936018	645a2cf901201ab61a0a70c90d0869cb
7	1	ghdfgh	2017-01-27 11:42:05.673939	
8	1	fsthrtyr	2017-01-27 11:42:10.518525	49a3a760fdbaffa152a23c70099e1b99
9	1	dfhdfhdfh	2017-01-30 12:09:34.479482	42d8ec0759ccfec7bcdb81cef2d17102
10	1	fgdfgdfg	2017-01-31 07:31:17.111479	04deace48888124017caef786f065ece
11	1	dfhdfhdf	2017-02-01 05:16:25.921389	
13	1	dfgdsfgdg	2017-02-01 05:52:25.322983	e335c47e5b7540c3b5617079f74530b8
12	1	dfdfdf	2017-02-01 05:16:33.159802	87af94a2f3351531077e81688e843b12
1	19	At Big Cinema, Crystal Mall, Rajkot	2017-01-27 06:45:51.06088	0ac4b1c2fd8da367a9796574cb35e425
5	19	fghfgyjftyyjty	2017-01-27 11:05:39.731697	d74fd28a76dee1431945ca0ce5a45813
2	1	Watching Ind Vs Eng First Match #1st t20	2017-01-27 06:46:38.231061	0ac4b1c2fd8da367a9796574cb35e425
\.


--
-- Name: user_tweet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: akib
--

SELECT pg_catalog.setval('user_tweet_id_seq', 13, true);


--
-- Name: follow follow_pkey; Type: CONSTRAINT; Schema: public; Owner: akib
--

ALTER TABLE ONLY follow
    ADD CONSTRAINT follow_pkey PRIMARY KEY (id);


--
-- Name: registration registration_email_key; Type: CONSTRAINT; Schema: public; Owner: akib
--

ALTER TABLE ONLY registration
    ADD CONSTRAINT registration_email_key UNIQUE (email);


--
-- Name: registration registration_pkey; Type: CONSTRAINT; Schema: public; Owner: akib
--

ALTER TABLE ONLY registration
    ADD CONSTRAINT registration_pkey PRIMARY KEY (user_id);


--
-- Name: user_tweet user_tweet_pkey; Type: CONSTRAINT; Schema: public; Owner: akib
--

ALTER TABLE ONLY user_tweet
    ADD CONSTRAINT user_tweet_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

