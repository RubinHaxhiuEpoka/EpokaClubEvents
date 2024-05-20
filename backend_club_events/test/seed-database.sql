CREATE TABLE public.club_presidents (
    president_id integer NOT NULL,
    club_name character varying(255) NOT NULL,
    president_email character varying(255) NOT NULL,
    president_password character varying(255) NOT NULL
);

CREATE SEQUENCE public.club_presidents_president_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE TABLE public.event_rating (
    rating_id integer NOT NULL,
    rating_number integer,
    student_comment character varying,
    student_id integer,
    event_id integer,
    CONSTRAINT event_rating_rating_number_check CHECK (((rating_number >= 1) AND (rating_number <= 5)))
);


CREATE SEQUENCE public.event_rating_rating_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE TABLE public.events (
    event_id integer NOT NULL,
    event_title character varying(255) NOT NULL,
    event_description text,
    event_image character varying(255),
    event_room character varying(255),
    event_date timestamp without time zone NOT NULL,
    event_quotas integer,
    president_id integer
);


CREATE SEQUENCE public.events_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.my_events (
    student_id integer NOT NULL,
    event_id integer NOT NULL,
    president_confirmed boolean DEFAULT false
);


CREATE TABLE public.students (
    student_id integer NOT NULL,
    student_name character varying(50) NOT NULL,
    student_surname character varying(50) NOT NULL,
    student_email character varying(100) NOT NULL,
    student_password character varying(255) NOT NULL
);
