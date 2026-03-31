--
-- PostgreSQL database dump
--

\restrict e180FBcnFXAPQRCDAfWy4nnpX79FiVxpR2yRtFJh5c5GteN8xVvO1p5eM6wQ4ro

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: drones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drones (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    owner_id integer,
    max_speed double precision DEFAULT 15.0,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now(),
    model text DEFAULT 'Generic'::text,
    status text DEFAULT 'inactive'::text
);


ALTER TABLE public.drones OWNER TO postgres;

--
-- Name: drones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.drones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.drones_id_seq OWNER TO postgres;

--
-- Name: drones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.drones_id_seq OWNED BY public.drones.id;


--
-- Name: flight_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flight_plans (
    id integer NOT NULL,
    user_id integer,
    drone_id integer,
    drone_name character varying NOT NULL,
    source character varying NOT NULL,
    destination character varying NOT NULL,
    path json NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.flight_plans OWNER TO postgres;

--
-- Name: flight_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.flight_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.flight_plans_id_seq OWNER TO postgres;

--
-- Name: flight_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.flight_plans_id_seq OWNED BY public.flight_plans.id;


--
-- Name: flightplans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flightplans (
    id integer NOT NULL,
    drone_id integer,
    plan jsonb,
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.flightplans OWNER TO postgres;

--
-- Name: flightplans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.flightplans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.flightplans_id_seq OWNER TO postgres;

--
-- Name: flightplans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.flightplans_id_seq OWNED BY public.flightplans.id;


--
-- Name: geofences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.geofences (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    polygon jsonb NOT NULL,
    type character varying(50) DEFAULT 'no-fly'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.geofences OWNER TO postgres;

--
-- Name: geofences_2; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.geofences_2 (
    id integer,
    name character varying(255),
    polygon jsonb,
    type character varying(50),
    created_at timestamp without time zone
);


ALTER TABLE public.geofences_2 OWNER TO postgres;

--
-- Name: geofences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.geofences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.geofences_id_seq OWNER TO postgres;

--
-- Name: geofences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.geofences_id_seq OWNED BY public.geofences.id;


--
-- Name: telemetry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.telemetry (
    id integer NOT NULL,
    drone_id integer,
    "timestamp" timestamp without time zone DEFAULT now(),
    lat double precision,
    lon double precision,
    alt double precision,
    raw jsonb,
    heading double precision DEFAULT 0.0,
    speed double precision DEFAULT 0.0
);


ALTER TABLE public.telemetry OWNER TO postgres;

--
-- Name: telemetry_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.telemetry_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.telemetry_id_seq OWNER TO postgres;

--
-- Name: telemetry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.telemetry_id_seq OWNED BY public.telemetry.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    hashed_password text NOT NULL,
    is_admin boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    is_verified boolean DEFAULT false,
    verification_code character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: drones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drones ALTER COLUMN id SET DEFAULT nextval('public.drones_id_seq'::regclass);


--
-- Name: flight_plans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flight_plans ALTER COLUMN id SET DEFAULT nextval('public.flight_plans_id_seq'::regclass);


--
-- Name: flightplans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flightplans ALTER COLUMN id SET DEFAULT nextval('public.flightplans_id_seq'::regclass);


--
-- Name: geofences id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geofences ALTER COLUMN id SET DEFAULT nextval('public.geofences_id_seq'::regclass);


--
-- Name: telemetry id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telemetry ALTER COLUMN id SET DEFAULT nextval('public.telemetry_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: drones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.drones (id, name, owner_id, max_speed, metadata, created_at, model, status) FROM stdin;
201	Simulated Drone 201	\N	43.2	\N	2025-09-11 18:57:46.611767	Simulation	active
3721	Simulated Drone 3721	\N	36	\N	2025-11-01 13:57:43.870404	Simulation	active
7326	Simulated Drone 7326	\N	36	\N	2025-11-01 13:57:51.103397	Simulation	active
3419	Simulated Drone 3419	\N	36	\N	2025-11-01 13:58:11.244381	Simulation	active
3900	Simulated Drone 3900	\N	36	\N	2025-11-01 14:01:06.645131	Simulation	active
5227	Simulated Drone 5227	\N	36	\N	2025-11-01 14:02:49.38973	Simulation	active
1648	Simulated Drone 1648	\N	36	\N	2025-11-01 14:06:38.150885	Simulation	active
9215	Simulated Drone 9215	\N	43.2	\N	2025-11-01 15:13:01.943135	Simulation	active
1624	Simulated Drone 1624	\N	43.2	\N	2025-11-01 15:13:16.237505	Simulation	active
9702	Simulated Drone 9702	\N	43.2	\N	2025-11-01 15:13:26.8088	Simulation	active
\.


--
-- Data for Name: flight_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flight_plans (id, user_id, drone_id, drone_name, source, destination, path, created_at) FROM stdin;
\.


--
-- Data for Name: flightplans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flightplans (id, drone_id, plan, status, created_at) FROM stdin;
\.


--
-- Data for Name: geofences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.geofences (id, name, polygon, type, created_at) FROM stdin;
1	Delhi Airport No-Fly Zone	[[28.5562, 77.1000], [28.5662, 77.1100], [28.5662, 77.0900], [28.5462, 77.0900], [28.5462, 77.1100]]	no-fly	2025-09-12 04:27:25.345257
2	Mumbai Airport No-Fly Zone	[[19.0887, 72.8679], [19.0987, 72.8779], [19.0987, 72.8579], [19.0787, 72.8579], [19.0787, 72.8779]]	no-fly	2025-09-12 04:27:25.345257
3	Chennai Airport No-Fly Zone	[[12.9941, 80.1707], [13.0041, 80.1807], [13.0041, 80.1607], [12.9841, 80.1607], [12.9841, 80.1807]]	no-fly	2025-09-12 04:27:25.345257
4	Bangalore Airport No-Fly Zone	[[13.1986, 77.7066], [13.2086, 77.7166], [13.2086, 77.6966], [13.1886, 77.6966], [13.1886, 77.7166]]	no-fly	2025-09-12 04:27:25.345257
5	Hyderabad Airport No-Fly Zone	[[17.2403, 78.4294], [17.2503, 78.4394], [17.2503, 78.4194], [17.2303, 78.4194], [17.2303, 78.4394]]	no-fly	2025-09-12 04:27:25.345257
6	Kolkata Airport No-Fly Zone	[[22.6547, 88.4467], [22.6647, 88.4567], [22.6647, 88.4367], [22.6447, 88.4367], [22.6447, 88.4567]]	no-fly	2025-09-12 04:27:25.345257
7	Cochin Airport No-Fly Zone	[[10.1520, 76.4019], [10.1620, 76.4119], [10.1620, 76.3919], [10.1420, 76.3919], [10.1420, 76.4119]]	no-fly	2025-09-12 04:27:25.345257
8	Ahmedabad Airport No-Fly Zone	[[23.0772, 72.6346], [23.0872, 72.6446], [23.0872, 72.6246], [23.0672, 72.6246], [23.0672, 72.6446]]	no-fly	2025-09-12 04:27:25.345257
9	Goa Airport No-Fly Zone	[[15.3808, 73.8314], [15.3908, 73.8414], [15.3908, 73.8214], [15.3708, 73.8214], [15.3708, 73.8414]]	no-fly	2025-09-12 04:27:25.345257
10	Pune Airport No-Fly Zone	[[18.5822, 73.9197], [18.5922, 73.9297], [18.5922, 73.9097], [18.5722, 73.9097], [18.5722, 73.9297]]	no-fly	2025-09-12 04:27:25.345257
11	Trivandrum Airport No-Fly Zone	[[8.4821, 76.9201], [8.4921, 76.9301], [8.4921, 76.9101], [8.4721, 76.9101], [8.4721, 76.9301]]	no-fly	2025-09-12 04:27:25.345257
12	Chandigarh Airport No-Fly Zone	[[30.6735, 76.7885], [30.6835, 76.7985], [30.6835, 76.7785], [30.6635, 76.7785], [30.6635, 76.7985]]	no-fly	2025-09-12 04:27:25.345257
13	Ranchi Airport No-Fly Zone	[[23.3143, 85.3217], [23.3243, 85.3317], [23.3243, 85.3117], [23.3043, 85.3117], [23.3043, 85.3317]]	no-fly	2025-09-12 04:27:25.345257
14	Patna Airport No-Fly Zone	[[25.5913, 85.0880], [25.6013, 85.0980], [25.6013, 85.0780], [25.5813, 85.0780], [25.5813, 85.0980]]	no-fly	2025-09-12 04:27:25.345257
15	Lucknow Airport No-Fly Zone	[[26.7606, 80.8893], [26.7706, 80.8993], [26.7706, 80.8793], [26.7506, 80.8793], [26.7506, 80.8993]]	no-fly	2025-09-12 04:27:25.345257
16	Guwahati Airport No-Fly Zone	[[26.1061, 91.5859], [26.1161, 91.5959], [26.1161, 91.5759], [26.0961, 91.5759], [26.0961, 91.5959]]	no-fly	2025-09-12 04:27:25.345257
17	Jaipur Airport No-Fly Zone	[[26.8242, 75.8122], [26.8342, 75.8222], [26.8342, 75.8022], [26.8142, 75.8022], [26.8142, 75.8222]]	no-fly	2025-09-12 04:27:25.345257
18	Varanasi Airport No-Fly Zone	[[25.4524, 82.8593], [25.4624, 82.8693], [25.4624, 82.8493], [25.4424, 82.8493], [25.4424, 82.8693]]	no-fly	2025-09-12 04:27:25.345257
19	Bagdogra Airport No-Fly Zone	[[26.6812, 88.3286], [26.6912, 88.3386], [26.6912, 88.3186], [26.6712, 88.3186], [26.6712, 88.3386]]	no-fly	2025-09-12 04:27:25.345257
20	Bhubaneswar Airport No-Fly Zone	[[20.2444, 85.8178], [20.2544, 85.8278], [20.2544, 85.8078], [20.2344, 85.8078], [20.2344, 85.8278]]	no-fly	2025-09-12 04:27:25.345257
200	Delhi Cantonment (Delhi Cantt) - Army (approx)	[[28.5889, 77.1324], [28.5909, 77.1344], [28.5869, 77.1344], [28.5849, 77.1324]]	red	2025-11-02 12:53:23.6434
201	Ambala Cantonment - Army (approx)	[[30.3721, 76.8005], [30.3741, 76.8025], [30.3701, 76.8025], [30.3681, 76.8005]]	red	2025-11-02 12:53:23.6434
202	Hindon Air Force Station (Ghaziabad) - IAF (approx)	[[28.7077, 77.3589], [28.7097, 77.3609], [28.7057, 77.3609], [28.7037, 77.3589]]	red	2025-11-02 12:53:23.6434
203	Lohegaon (Lochagaon) / Pune (Lohegaon AFS) - IAF (approx)	[[18.5960, 73.9247], [18.5980, 73.9267], [18.5940, 73.9267], [18.5920, 73.9247]]	red	2025-11-02 12:53:23.6434
204	Yelahanka Air Force Station (Bengaluru) - IAF (approx)	[[13.1355, 77.6060], [13.1375, 77.6080], [13.1335, 77.6080], [13.1315, 77.6060]]	red	2025-11-02 12:53:23.6434
205	Kalaikunda AFS (West Bengal) - IAF (approx)	[[22.3090, 87.3100], [22.3110, 87.3120], [22.3070, 87.3120], [22.3050, 87.3100]]	red	2025-11-02 12:53:23.6434
206	INS Venduruthy (Willingdon Island, Kochi) - Navy (approx)	[[9.9458, 76.2878], [9.9478, 76.2898], [9.9438, 76.2898], [9.9418, 76.2878]]	red	2025-11-02 12:53:23.6434
207	INS Kadamba (Karwar) - Navy (approx)	[[14.8014, 74.1241], [14.8034, 74.1261], [14.7994, 74.1261], [14.7974, 74.1241]]	red	2025-11-02 12:53:23.6434
208	Visakhapatnam Naval Base / Eastern Naval Command (approx)	[[17.6868, 83.2185], [17.6888, 83.2205], [17.6848, 83.2205], [17.6828, 83.2185]]	red	2025-11-02 12:53:23.6434
209	Port Blair / Andaman Naval Region (approx)	[[11.6667, 92.7458], [11.6687, 92.7478], [11.6647, 92.7478], [11.6627, 92.7458]]	red	2025-11-02 12:53:23.6434
210	Parliament House, New Delhi	[[28.6172, 77.2080], [28.6187, 77.2095], [28.6162, 77.2110], [28.6147, 77.2095]]	red	2025-11-02 12:59:04.460602
211	Rashtrapati Bhavan, New Delhi	[[28.6140, 77.1970], [28.6155, 77.1985], [28.6130, 77.2000], [28.6115, 77.1985]]	red	2025-11-02 12:59:04.460602
212	Prime Ministers Office (PMO), South Block, New Delhi	[[28.6145, 77.1995], [28.6160, 77.2010], [28.6135, 77.2025], [28.6120, 77.2010]]	red	2025-11-02 12:59:04.460602
213	North Block, New Delhi	[[28.6168, 77.2088], [28.6183, 77.2103], [28.6158, 77.2118], [28.6143, 77.2103]]	red	2025-11-02 12:59:04.460602
214	South Block, New Delhi	[[28.6130, 77.2070], [28.6145, 77.2085], [28.6120, 77.2100], [28.6105, 77.2085]]	red	2025-11-02 12:59:04.460602
800	Kashi Vishwanath Temple, Varanasi	[[25.3100, 83.0060], [25.3130, 83.0100], [25.3090, 83.0130], [25.3060, 83.0090]]	with permission	2025-11-02 12:59:38.844328
802	Tirumala Tirupati Temple, Andhra Pradesh	[[13.6830, 79.3470], [13.6865, 79.3510], [13.6820, 79.3540], [13.6785, 79.3500]]	with permission	2025-11-02 12:59:38.844328
803	Meenakshi Temple, Madurai	[[9.9190, 78.1190], [9.9225, 78.1230], [9.9180, 78.1260], [9.9145, 78.1220]]	with permission	2025-11-02 12:59:38.844328
804	Somnath Temple, Gujarat	[[20.8870, 70.4010], [20.8905, 70.4050], [20.8860, 70.4080], [20.8825, 70.4040]]	with permission	2025-11-02 12:59:38.844328
805	Akshardham Temple, Delhi	[[28.6120, 77.2770], [28.6155, 77.2810], [28.6110, 77.2840], [28.6075, 77.2800]]	with permission	2025-11-02 12:59:38.844328
806	Vaishno Devi Shrine, Jammu	[[33.0300, 74.9490], [33.0335, 74.9530], [33.0290, 74.9560], [33.0255, 74.9520]]	with permission	2025-11-02 12:59:38.844328
807	Jama Masjid, Delhi	[[28.6500, 77.2330], [28.6535, 77.2370], [28.6490, 77.2400], [28.6455, 77.2360]]	with permission	2025-11-02 12:59:38.844328
808	Haji Ali Dargah, Mumbai	[[18.9770, 72.8080], [18.9805, 72.8120], [18.9760, 72.8150], [18.9725, 72.8110]]	with permission	2025-11-02 12:59:38.844328
809	Charminar Mosque, Hyderabad	[[17.3610, 78.4740], [17.3645, 78.4780], [17.3600, 78.4810], [17.3565, 78.4770]]	with permission	2025-11-02 12:59:38.844328
810	Basilica of Bom Jesus, Goa	[[15.5020, 73.9120], [15.5055, 73.9160], [15.5010, 73.9190], [15.4975, 73.9150]]	with permission	2025-11-02 12:59:38.844328
811	San Thome Basilica, Chennai	[[13.0310, 80.2750], [13.0345, 80.2790], [13.0300, 80.2820], [13.0265, 80.2780]]	with permission	2025-11-02 12:59:38.844328
812	Se Cathedral, Old Goa	[[15.5000, 73.9110], [15.5035, 73.9150], [15.4990, 73.9180], [15.4955, 73.9140]]	with permission	2025-11-02 12:59:38.844328
813	Golden Temple, Amritsar	[[31.6210, 74.8750], [31.6245, 74.8795], [31.6200, 74.8825], [31.6165, 74.8780]]	with permission	2025-11-02 12:59:38.844328
814	Gurudwara Bangla Sahib, Delhi	[[28.6260, 77.2080], [28.6295, 77.2120], [28.6250, 77.2150], [28.6215, 77.2110]]	with permission	2025-11-02 12:59:38.844328
815	India Gate Lawns, New Delhi	[[28.6100, 77.2260], [28.6135, 77.2300], [28.6090, 77.2330], [28.6055, 77.2290]]	with permission	2025-11-02 12:59:38.844328
816	Ramlila Maidan, Delhi	[[28.6480, 77.2310], [28.6515, 77.2350], [28.6470, 77.2380], [28.6435, 77.2340]]	with permission	2025-11-02 12:59:38.844328
817	Marina Beach, Chennai	[[13.0490, 80.2830], [13.0525, 80.2870], [13.0480, 80.2900], [13.0445, 80.2860]]	with permission	2025-11-02 12:59:38.844328
818	Eden Gardens, Kolkata	[[22.5630, 88.3420], [22.5665, 88.3460], [22.5620, 88.3490], [22.5585, 88.3450]]	with permission	2025-11-02 12:59:38.844328
819	Gateway of India, Mumbai	[[18.9210, 72.8320], [18.9245, 72.8360], [18.9200, 72.8390], [18.9165, 72.8350]]	with permission	2025-11-02 12:59:38.844328
820	Sabarmati Riverfront, Ahmedabad	[[23.0430, 72.5690], [23.0465, 72.5730], [23.0420, 72.5760], [23.0385, 72.5720]]	with permission	2025-11-02 12:59:38.844328
821	Brigade Parade Ground, Kolkata	[[22.5520, 88.3440], [22.5555, 88.3480], [22.5510, 88.3510], [22.5475, 88.3470]]	with permission	2025-11-02 12:59:38.844328
822	Red Fort Grounds, Delhi	[[28.6560, 77.2370], [28.6595, 77.2410], [28.6550, 77.2440], [28.6515, 77.2400]]	with permission	2025-11-02 12:59:38.844328
823	Shree Siddhivinayak Temple, Mumbai	[[19.0160, 72.8300], [19.0195, 72.8340], [19.0150, 72.8370], [19.0115, 72.8330]]	with permission	2025-11-02 12:59:38.844328
801	Jagannath Temple, Puri	[[19.8068, 85.8158], [19.8068, 85.8208], [19.8028, 85.8208], [19.8028, 85.8158]]	with permission	2025-11-02 13:13:33.781091
700	Bhubaneswar Railway Station	[[20.2450, 85.8340], [20.2475, 85.8385], [20.2430, 85.8410], [20.2405, 85.8360]]	with permission	2025-11-02 13:14:18.836294
701	Cuttack Railway Station	[[20.4640, 85.8750], [20.4675, 85.8790], [20.4630, 85.8820], [20.4595, 85.8775]]	with permission	2025-11-02 13:14:18.836294
702	Puri Railway Station	[[19.8120, 85.8250], [19.8155, 85.8295], [19.8110, 85.8325], [19.8075, 85.8280]]	with permission	2025-11-02 13:14:18.836294
703	Sambalpur Junction	[[21.4740, 83.9630], [21.4775, 83.9670], [21.4730, 83.9700], [21.4695, 83.9660]]	with permission	2025-11-02 13:14:18.836294
704	Rourkela Junction	[[22.2320, 84.8570], [22.2355, 84.8610], [22.2310, 84.8640], [22.2275, 84.8600]]	with permission	2025-11-02 13:14:18.836294
705	Berhampur Railway Station	[[19.3100, 84.7840], [19.3135, 84.7880], [19.3090, 84.7910], [19.3055, 84.7870]]	with permission	2025-11-02 13:14:18.836294
706	Balasore Railway Station	[[21.4930, 86.9190], [21.4965, 86.9235], [21.4920, 86.9265], [21.4885, 86.9220]]	with permission	2025-11-02 13:14:18.836294
707	Jharsuguda Junction	[[21.8570, 84.0090], [21.8605, 84.0130], [21.8560, 84.0160], [21.8525, 84.0120]]	with permission	2025-11-02 13:14:18.836294
708	Angul Railway Station	[[20.8370, 85.0920], [20.8405, 85.0960], [20.8360, 85.0990], [20.8325, 85.0950]]	with permission	2025-11-02 13:14:18.836294
709	Titlagarh Junction	[[20.2900, 83.1490], [20.2935, 83.1530], [20.2890, 83.1560], [20.2855, 83.1520]]	with permission	2025-11-02 13:14:18.836294
710	Rayagada Railway Station	[[19.1720, 83.4120], [19.1755, 83.4160], [19.1710, 83.4190], [19.1675, 83.4150]]	with permission	2025-11-02 13:14:18.836294
711	Koraput Railway Station	[[18.8140, 82.7210], [18.8175, 82.7250], [18.8130, 82.7280], [18.8095, 82.7240]]	with permission	2025-11-02 13:14:18.836294
712	Balangir Railway Station	[[20.7190, 83.4870], [20.7225, 83.4910], [20.7180, 83.4940], [20.7145, 83.4900]]	with permission	2025-11-02 13:14:18.836294
713	Khurda Road Junction	[[20.1490, 85.6660], [20.1525, 85.6700], [20.1480, 85.6730], [20.1445, 85.6690]]	with permission	2025-11-02 13:14:18.836294
714	Bhadrak Railway Station	[[21.0610, 86.4960], [21.0645, 86.5000], [21.0600, 86.5030], [21.0565, 86.4990]]	with permission	2025-11-02 13:14:18.836294
715	Jajpur Keonjhar Road Station	[[20.9050, 86.1140], [20.9085, 86.1180], [20.9040, 86.1210], [20.9005, 86.1170]]	with permission	2025-11-02 13:14:18.836294
716	Dhenkanal Railway Station	[[20.6550, 85.6170], [20.6585, 85.6210], [20.6540, 85.6240], [20.6505, 85.6200]]	with permission	2025-11-02 13:14:18.836294
717	Kendujhargarh Railway Station	[[21.6320, 85.5920], [21.6355, 85.5960], [21.6310, 85.5990], [21.6275, 85.5950]]	with permission	2025-11-02 13:14:18.836294
\.


--
-- Data for Name: geofences_2; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.geofences_2 (id, name, polygon, type, created_at) FROM stdin;
1	Delhi Airport No-Fly Zone	[[28.5562, 77.1000], [28.5662, 77.1100], [28.5662, 77.0900], [28.5462, 77.0900], [28.5462, 77.1100]]	no-fly	2025-09-12 04:27:25.345257
2	Mumbai Airport No-Fly Zone	[[19.0887, 72.8679], [19.0987, 72.8779], [19.0987, 72.8579], [19.0787, 72.8579], [19.0787, 72.8779]]	no-fly	2025-09-12 04:27:25.345257
3	Chennai Airport No-Fly Zone	[[12.9941, 80.1707], [13.0041, 80.1807], [13.0041, 80.1607], [12.9841, 80.1607], [12.9841, 80.1807]]	no-fly	2025-09-12 04:27:25.345257
4	Bangalore Airport No-Fly Zone	[[13.1986, 77.7066], [13.2086, 77.7166], [13.2086, 77.6966], [13.1886, 77.6966], [13.1886, 77.7166]]	no-fly	2025-09-12 04:27:25.345257
5	Hyderabad Airport No-Fly Zone	[[17.2403, 78.4294], [17.2503, 78.4394], [17.2503, 78.4194], [17.2303, 78.4194], [17.2303, 78.4394]]	no-fly	2025-09-12 04:27:25.345257
6	Kolkata Airport No-Fly Zone	[[22.6547, 88.4467], [22.6647, 88.4567], [22.6647, 88.4367], [22.6447, 88.4367], [22.6447, 88.4567]]	no-fly	2025-09-12 04:27:25.345257
7	Cochin Airport No-Fly Zone	[[10.1520, 76.4019], [10.1620, 76.4119], [10.1620, 76.3919], [10.1420, 76.3919], [10.1420, 76.4119]]	no-fly	2025-09-12 04:27:25.345257
8	Ahmedabad Airport No-Fly Zone	[[23.0772, 72.6346], [23.0872, 72.6446], [23.0872, 72.6246], [23.0672, 72.6246], [23.0672, 72.6446]]	no-fly	2025-09-12 04:27:25.345257
9	Goa Airport No-Fly Zone	[[15.3808, 73.8314], [15.3908, 73.8414], [15.3908, 73.8214], [15.3708, 73.8214], [15.3708, 73.8414]]	no-fly	2025-09-12 04:27:25.345257
10	Pune Airport No-Fly Zone	[[18.5822, 73.9197], [18.5922, 73.9297], [18.5922, 73.9097], [18.5722, 73.9097], [18.5722, 73.9297]]	no-fly	2025-09-12 04:27:25.345257
11	Trivandrum Airport No-Fly Zone	[[8.4821, 76.9201], [8.4921, 76.9301], [8.4921, 76.9101], [8.4721, 76.9101], [8.4721, 76.9301]]	no-fly	2025-09-12 04:27:25.345257
12	Chandigarh Airport No-Fly Zone	[[30.6735, 76.7885], [30.6835, 76.7985], [30.6835, 76.7785], [30.6635, 76.7785], [30.6635, 76.7985]]	no-fly	2025-09-12 04:27:25.345257
13	Ranchi Airport No-Fly Zone	[[23.3143, 85.3217], [23.3243, 85.3317], [23.3243, 85.3117], [23.3043, 85.3117], [23.3043, 85.3317]]	no-fly	2025-09-12 04:27:25.345257
14	Patna Airport No-Fly Zone	[[25.5913, 85.0880], [25.6013, 85.0980], [25.6013, 85.0780], [25.5813, 85.0780], [25.5813, 85.0980]]	no-fly	2025-09-12 04:27:25.345257
15	Lucknow Airport No-Fly Zone	[[26.7606, 80.8893], [26.7706, 80.8993], [26.7706, 80.8793], [26.7506, 80.8793], [26.7506, 80.8993]]	no-fly	2025-09-12 04:27:25.345257
16	Guwahati Airport No-Fly Zone	[[26.1061, 91.5859], [26.1161, 91.5959], [26.1161, 91.5759], [26.0961, 91.5759], [26.0961, 91.5959]]	no-fly	2025-09-12 04:27:25.345257
17	Jaipur Airport No-Fly Zone	[[26.8242, 75.8122], [26.8342, 75.8222], [26.8342, 75.8022], [26.8142, 75.8022], [26.8142, 75.8222]]	no-fly	2025-09-12 04:27:25.345257
18	Varanasi Airport No-Fly Zone	[[25.4524, 82.8593], [25.4624, 82.8693], [25.4624, 82.8493], [25.4424, 82.8493], [25.4424, 82.8693]]	no-fly	2025-09-12 04:27:25.345257
19	Bagdogra Airport No-Fly Zone	[[26.6812, 88.3286], [26.6912, 88.3386], [26.6912, 88.3186], [26.6712, 88.3186], [26.6712, 88.3386]]	no-fly	2025-09-12 04:27:25.345257
20	Bhubaneswar Airport No-Fly Zone	[[20.2444, 85.8178], [20.2544, 85.8278], [20.2544, 85.8078], [20.2344, 85.8078], [20.2344, 85.8278]]	no-fly	2025-09-12 04:27:25.345257
\.


--
-- Data for Name: telemetry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.telemetry (id, drone_id, "timestamp", lat, lon, alt, raw, heading, speed) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, hashed_password, is_admin, created_at, is_verified, verification_code) FROM stdin;
1	bhatterakshat@gmail.com	$2b$12$EIunD0IQ7WYiQDiWyyvpn.AWKb.2wM0Av8c2ZrM.99zjdpFXXRFki	f	2025-10-31 09:57:36.937069	f	\N
4	2230339@kiit.ac.in	$2b$12$MS1E44C/DIe/Ur11DieH4ekBdGzdqCAqF7Go2cJOsdOuJlbPaEXO2	f	2025-11-01 10:00:04.88489	t	\N
5	2230213@kiit.ac.in	$2b$12$8No5WGmPTVxpEkkqMDZCcuuly2OnorOY9aBmdImYzcT7oe5HD.KdO	f	2025-11-01 10:01:36.236237	t	\N
6	2230332@kiit.ac.in	$2b$12$BIwFSM3YONv3q8B16HTm4e/GC1UiS6vPYGhxdZFYvX3J5PzQb6dCi	f	2025-11-01 11:04:25.949346	t	\N
\.


--
-- Name: drones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.drones_id_seq', 1, false);


--
-- Name: flight_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.flight_plans_id_seq', 1, false);


--
-- Name: flightplans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.flightplans_id_seq', 1, true);


--
-- Name: geofences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.geofences_id_seq', 21, false);


--
-- Name: telemetry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.telemetry_id_seq', 10, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: drones drones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drones
    ADD CONSTRAINT drones_pkey PRIMARY KEY (id);


--
-- Name: flight_plans flight_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flight_plans
    ADD CONSTRAINT flight_plans_pkey PRIMARY KEY (id);


--
-- Name: flightplans flightplans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flightplans
    ADD CONSTRAINT flightplans_pkey PRIMARY KEY (id);


--
-- Name: geofences geofences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geofences
    ADD CONSTRAINT geofences_pkey PRIMARY KEY (id);


--
-- Name: telemetry telemetry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telemetry
    ADD CONSTRAINT telemetry_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_flightplans_drone_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_flightplans_drone_id ON public.flight_plans USING btree (drone_id);


--
-- Name: idx_flightplans_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_flightplans_user_id ON public.flight_plans USING btree (user_id);


--
-- Name: idx_telemetry_drone_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_telemetry_drone_id ON public.telemetry USING btree (drone_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: drones drones_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drones
    ADD CONSTRAINT drones_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: flight_plans flight_plans_drone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flight_plans
    ADD CONSTRAINT flight_plans_drone_id_fkey FOREIGN KEY (drone_id) REFERENCES public.drones(id) ON DELETE CASCADE;


--
-- Name: flight_plans flight_plans_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flight_plans
    ADD CONSTRAINT flight_plans_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: flightplans flightplans_drone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flightplans
    ADD CONSTRAINT flightplans_drone_id_fkey FOREIGN KEY (drone_id) REFERENCES public.drones(id);


--
-- Name: telemetry telemetry_drone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telemetry
    ADD CONSTRAINT telemetry_drone_id_fkey FOREIGN KEY (drone_id) REFERENCES public.drones(id);


--
-- PostgreSQL database dump complete
--

\unrestrict e180FBcnFXAPQRCDAfWy4nnpX79FiVxpR2yRtFJh5c5GteN8xVvO1p5eM6wQ4ro

