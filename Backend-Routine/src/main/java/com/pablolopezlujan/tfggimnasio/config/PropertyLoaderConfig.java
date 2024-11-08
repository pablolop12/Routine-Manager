package com.pablolopezlujan.tfggimnasio.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import jakarta.annotation.PostConstruct;

@Configuration
@PropertySource("classpath:application-env.properties")
public class PropertyLoaderConfig {
    @Value("${DB_HOST}")
    private String dbHost;

    @Value("${DB_PORT}")
    private String dbPort;

    @Value("${DB_NAME}")
    private String dbName;

    @Value("${DB_USERNAME}")
    private String dbUsername;

    @Value("${DB_PASSWORD}")
    private String dbPassword;

    @Value("${MAIL_USERNAME}")
    private String mailUsername;

    @Value("${MAIL_PASSWORD}")
    private String mailPassword;

    @PostConstruct
    public void init() {
        System.setProperty("DB_HOST", dbHost);
        System.setProperty("DB_PORT", dbPort);
        System.setProperty("DB_NAME", dbName);
        System.setProperty("DB_USERNAME", dbUsername);
        System.setProperty("DB_PASSWORD", dbPassword);
        System.setProperty("MAIL_USERNAME", mailUsername);
        System.setProperty("MAIL_PASSWORD", mailPassword);
    }
}
