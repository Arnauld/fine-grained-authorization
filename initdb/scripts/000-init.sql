CREATE OR REPLACE PROCEDURE create_role_if_not_exists(role_name text, stmt text)
    LANGUAGE plpgsql AS
$proc$
BEGIN
    IF NOT EXISTS (
            SELECT FROM pg_catalog.pg_roles  -- SELECT list can be empty for this
            WHERE  rolname = role_name) THEN
        EXECUTE format('CREATE ROLE %I %s', role_name, stmt);
        RAISE NOTICE 'ROLE % created with: %', role_name, stmt;
    END IF;
END
$proc$;
-- ;;


CALL create_role_if_not_exists('openfga', 'WITH PASSWORD ''openfga'' LOGIN BYPASSRLS');

CREATE DATABASE openfga_db WITH 
    TEMPLATE = template0
    ENCODING = 'UTF8'
    TABLESPACE = pg_default
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    CONNECTION LIMIT = 255;

ALTER DATABASE openfga_db OWNER TO openfga;
GRANT CONNECT ON DATABASE openfga_db TO openfga;
