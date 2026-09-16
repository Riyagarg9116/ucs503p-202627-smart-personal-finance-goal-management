package com.finance.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    // Keep this secret private.
    // For a real deployment, store it in an environment variable.
    private static final String SECRET_KEY =
            "MySuperSecretKeyForSmartFinanceApplication2026VerySecure12345";

    // Token validity: 24 hours
    private static final long EXPIRATION_TIME =
            1000 * 60 * 60 * 24;

    private final SecretKey key =
            Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

    // Generate JWT token
    public String generateToken(String email) {

        Date now = new Date();
        Date expiryDate =
                new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    // Extract email from JWT
    public String extractEmail(String token) {

        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    // Validate JWT
    public boolean isTokenValid(String token, String email) {

        try {

            String tokenEmail = extractEmail(token);

            return tokenEmail.equals(email)
                    && !isTokenExpired(token);

        } catch (Exception e) {

            return false;
        }
    }

    // Check token expiry
    private boolean isTokenExpired(String token) {

        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getExpiration().before(new Date());
    }
}