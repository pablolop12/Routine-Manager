package com.pablolopezlujan.tfggimnasio.security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.pablolopezlujan.tfggimnasio.security.jwt.TokenUtils;

import java.io.IOException;

@Component
public class RequestFilter extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		
		final String requestTokenHeader = request.getHeader("Authorization");
		if (requestTokenHeader != null) {
		    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken;
		    try {
			    usernamePasswordAuthenticationToken = TokenUtils.getAuthentication(requestTokenHeader);
				usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
			    // After setting the Authentication in the context, we specify
			    // that the current user is authenticated. So it passes the
			    // Spring Security Configurations successfully.
			    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
			    
			} catch (Exception e) {
				logger.error(e.getMessage());
			}
		}
	   
			   
		chain.doFilter(request, response);

	}

}