


CREATE TABLE companii (
    companie_id SERIAL PRIMARY KEY,
    nume VARCHAR(255) NOT NULL UNIQUE,
    domeniu VARCHAR(255),
    adresa_birou TEXT,
    website VARCHAR(255),
    office_contact VARCHAR(255)
);
\
CREATE TABLE persoane_contact (
    contact_id SERIAL PRIMARY KEY,
    companie_id INTEGER NOT NULL,
    nume_prenume VARCHAR(255) NOT NULL,
    pozitie VARCHAR(255),
    email VARCHAR(255),
    telefon VARCHAR(50),
    
   
    CONSTRAINT fk_companie_contact FOREIGN KEY (companie_id)
        REFERENCES companii(companie_id) ON DELETE CASCADE,
    

    CONSTRAINT uq_nume_companie UNIQUE (companie_id, nume_prenume)
);


CREATE TABLE sponsorizari_istoric (
    istoric_id SERIAL PRIMARY KEY,
    companie_id INTEGER NOT NULL,
    sezon VARCHAR(10) NOT NULL,
    masina VARCHAR(100),
    status_contact VARCHAR(255),
    pachet VARCHAR(100),
    valoare TEXT,
    responsabil_tu VARCHAR(100),
    comentarii TEXT,
    
 
    CONSTRAINT fk_companie_istoric FOREIGN KEY (companie_id)
        REFERENCES companii(companie_id) ON DELETE CASCADE,

    CONSTRAINT uq_sponsorizare_sezon UNIQUE (companie_id, sezon)
);