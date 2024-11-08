package com.pablolopezlujan.tfggimnasio.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuarios")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contrasena", nullable = false)
    private String password;

    @Email
    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "nombre")
    private String name;

    @Column(name = "apellidos")
    private String lastname;

    @Column(name = "roles")
    private Role role;

    @Column(name = "reset_password_token")
    private String resetPasswordToken;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "reset_password_expires")
    private Date resetPasswordExpires;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rutina> rutinas;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Dieta> dietas;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ConfirmationToken> confirmationTokens;

    @Column(name = "movil")
    private String movil;

    @Column(name = "enabled")
    private boolean enabled = false;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", apellidos='" + lastname + '\'' +
                ", nombre='" + name + '\'' +
                ", contrasena='" + password + '\'' +
                ", roles='" + role + '\'' +
                ", movil='" + movil + '\'' +
                '}';
    }
}
