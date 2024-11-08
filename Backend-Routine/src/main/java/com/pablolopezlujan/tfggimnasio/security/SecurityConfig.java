package com.pablolopezlujan.tfggimnasio.security;

import com.pablolopezlujan.tfggimnasio.security.jwt.TokenUtils;
import com.pablolopezlujan.tfggimnasio.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private AuthEntryPoint authEntryPoint;

    @Autowired
    private RequestFilter requestFilter;

    @Bean
    TokenUtils tokenUtils(){
        return new TokenUtils();
    }

    @Bean
    UserService userDetailsService() {
        return new UserService();
    }

    @Bean
    BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling((exceptionHandling) -> exceptionHandling.authenticationEntryPoint(authEntryPoint))
            .authorizeHttpRequests((requests) -> {
                requests
                    .requestMatchers("/api/v1/auth/forgot-password").permitAll()
                    .requestMatchers("/api/v1/auth/reset-password").permitAll()
                    .requestMatchers("/api/v1/auth/confirm").permitAll()
                    .requestMatchers("/api/v1/auth/register").permitAll()
                    .requestMatchers("/api/v1/auth/**").permitAll()
                    .anyRequest().authenticated();
            })
            .formLogin((form) -> form.permitAll())
            .logout((logout) -> logout.permitAll().logoutSuccessUrl("/"));

        http.addFilterBefore(requestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
