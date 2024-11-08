package com.pablolopezlujan.tfggimnasio.security.jwt;

import com.pablolopezlujan.tfggimnasio.exception.errores.ExceptionTokenNotValid;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class TokenUtils {

    static Logger logger = LoggerFactory.getLogger(TokenUtils.class);
    private final static String ACCESS_TOKEN_SECRET = "sksksskskskskiwoapqowlaskdeokeofkeoefkeokfeofkeofkeofof";

    
    private final static Long ACCESS_TOKEN_VALIDITY_SECONDS = 10000 * 60 * 60L; // 10000 horas

    /**
     * Este método va a generar un token. En el token incluiremos el username, email y role. 
     * Esto es un ejemplo, en el token podemos almacenar la información que necesite nuestra aplicación, por ejemplo, nombre y apellido 
     * o lo que consideremos necesario.
     * @param id guardaremos el id dentro del token
     * @param name guardaremos el nombre dentro del token
     * @param lastname guardaremos el apellido dentro del token
     * @param email guardaremos el email dentro del token
     * @param role guardaremos el role dentro del token. Si pudiera tener varios roles, también se podría guardar.
     * @return el token generado
     */
    public static String generateToken(Long id, String name, String lastname, String email, String role) {
        // Establecemos la fecha de expiración del token en milisegundos
        Date generationDate = new Date(System.currentTimeMillis());
        Date expirationDate = new Date(System.currentTimeMillis() + ACCESS_TOKEN_VALIDITY_SECONDS * 1000);

        // Creamos un mapa para guardar toda la información que queramos guardar en el token
        // El username no es necesario guardarlo porque ya va en el token, en el subject.
        Map<String, Object> extra = new HashMap<>();
        extra.put("id", id);
        extra.put("name", name);
        extra.put("lastname", lastname);
        extra.put("email", email);
        extra.put("role", role);
        logger.debug(extra.toString());

        // Construimos el token con el nombre del usuario, la fecha de expiración, la información
        // que queremos guardar y el token que vamos a usar para encriptarlo.
        String token = Jwts.builder()
                //.subject(username)
                .issuedAt(generationDate)
                .expiration(expirationDate)
                .claims(extra)
                .signWith(Keys.hmacShaKeyFor(ACCESS_TOKEN_SECRET.getBytes()))
                .compact();

        return /*"Bearer " + */token;
    }

    public static String generateToken(Map<String, Object> extra) {
        // Establecemos la fecha de expiración del token en milisegundos
        Date generationDate = new Date(System.currentTimeMillis());
        Date expirationDate = new Date(System.currentTimeMillis() + ACCESS_TOKEN_VALIDITY_SECONDS * 1000);

        logger.debug(extra.toString());

        // Construimos el token con el nombre del usuario, la fecha de expiración, la información
        // que queremos guardar y el token que vamos a usar para encriptarlo.
        String token = Jwts.builder()
                //.subject(username)
                .issuedAt(generationDate)
                .expiration(expirationDate)
                .claims(extra)
                .signWith(Keys.hmacShaKeyFor(ACCESS_TOKEN_SECRET.getBytes()))
                .compact();

        return /*"Bearer " + */token;
    }

    /**
     * Obtiene el payload de un token
     * @param token
     * @return Claims
     * @throws JwtException
     * @throws IllegalArgumentException
     * @throws NoSuchAlgorithmException
     */
    public static Claims getAllClaimsFromToken(String token) throws JwtException, IllegalArgumentException, NoSuchAlgorithmException {
    	
    	Claims claims = 
    			Jwts.parser().verifyWith(Keys.hmacShaKeyFor(ACCESS_TOKEN_SECRET.getBytes())) 
    					.build()
    					.parseSignedClaims(token)
    					.getPayload();
        return claims;
    }

    /**
     * Método para ver el usuario y el rol que "contiene" el token. Lo primero
     * que haremos es decodificar el claims. Si lanza una exception es que no es 
     * válido usando nuestro token secreto. Si es válido vemos la fecha de expiracion
     * Sacamos el nombre y los roles y lo devolvemos.
     * @param token
     * @return UsernamePasswordAuthenticationToken
     * @throws JwtException
     * @throws IllegalArgumentException
     * @throws NoSuchAlgorithmException
     */
    public static UsernamePasswordAuthenticationToken getAuthentication(String token) throws JwtException, IllegalArgumentException, NoSuchAlgorithmException {
        Claims claims;

        if (!token.startsWith("Bearer ")) {
            throw new ExceptionTokenNotValid("Formato token no válido");
        }
        token = token.substring(7);
        try {
            claims = getAllClaimsFromToken(token);
        } catch (IllegalArgumentException e) {
            throw new ExceptionTokenNotValid("Imposible encontrar un JWT Token");
        } catch (ExpiredJwtException e) {
            throw new ExceptionTokenNotValid("Token expirado");
        } catch (NoSuchAlgorithmException e) {
            throw new ExceptionTokenNotValid("Algoritmo no válido");
        }

        String email = claims.get("email", String.class);
        String role = claims.get("role", String.class);
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role));

        return new UsernamePasswordAuthenticationToken(email, null, authorities);
    }
}
