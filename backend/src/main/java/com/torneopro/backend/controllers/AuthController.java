package com.torneopro.backend.controllers;

import com.torneopro.backend.dtos.AuthRequest;
import com.torneopro.backend.dtos.AuthResponse;
import com.torneopro.backend.dtos.RegisterRequest;
import com.torneopro.backend.dtos.ProfileResponse;
import com.torneopro.backend.models.Usuario;
import com.torneopro.backend.repositories.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (usuarioRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El correo ya está registrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setEmail(email);
        usuario.setNombre(request.nombre().trim());
        usuario.setApellido(request.apellido().trim());
        usuario.setCelular(request.celular().trim());
        usuario.setPasswordHash(passwordEncoder.encode(request.password()));
        Usuario saved = usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(saved.getId(), saved.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        return usuarioRepository.findByEmail(email)
                .filter(usuario -> passwordEncoder.matches(request.password(), usuario.getPasswordHash()))
                .<ResponseEntity<?>>map(usuario -> ResponseEntity.ok(new AuthResponse(usuario.getId(), usuario.getEmail())))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Correo o contraseña incorrectos."));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@RequestParam String email) {
        return usuarioRepository.findByEmail(email.trim().toLowerCase(Locale.ROOT))
                .<ResponseEntity<?>>map(usuario -> ResponseEntity.ok(new ProfileResponse(
                        usuario.getId(), usuario.getNombre(), usuario.getApellido(), usuario.getCelular(), usuario.getEmail()
                )))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
