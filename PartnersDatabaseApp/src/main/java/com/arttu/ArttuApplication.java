package com.arttu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ArttuApplication {

    public static void main(String[] args) {
        Database.initializeDatabase();
        SpringApplication.run(ArttuApplication.class, args);
    }

}
