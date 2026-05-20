package com.pqrs.system_pqrs.security;

import com.pqrs.system_pqrs.document.Miembro;
import com.pqrs.system_pqrs.repository.MiembroRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final MiembroRepository miembroRepository;

    public UserDetailsServiceImpl(MiembroRepository miembroRepository) {
        this.miembroRepository = miembroRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Miembro miembro = miembroRepository.findByCorreoMiembro(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + correo));

        return new User(
                miembro.getCorreoMiembro(),
                miembro.getPasswordMiembro(),
                List.of(new SimpleGrantedAuthority("ROLE_" + miembro.getRol().name()))
        );
    }
}
