package com.pqrs.system_pqrs.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.pqrs.system_pqrs.document.Miembro;
import com.pqrs.system_pqrs.document.Peticion;
import com.pqrs.system_pqrs.document.embedded.EvidenciaEmbedded;
import com.pqrs.system_pqrs.repository.MiembroRepository;
import com.pqrs.system_pqrs.repository.PeticionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private static final Logger log = LoggerFactory.getLogger(FileUploadController.class);

    private final MiembroRepository miembroRepository;
    private final Cloudinary cloudinary;
    private final PeticionRepository peticionRepository;

    public FileUploadController(MiembroRepository miembroRepository,
                                 Cloudinary cloudinary,
                                 PeticionRepository peticionRepository) {
        this.miembroRepository = miembroRepository;
        this.cloudinary = cloudinary;
        this.peticionRepository = peticionRepository;
    }

    @PostMapping("/foto-perfil")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadFotoPerfil(@RequestParam("file") MultipartFile file,
                                              Authentication auth) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Archivo vacío"));
        }

        try {
            var uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "fotos-perfil",
                            "resource_type", "image"
                    )
            );

            String url = (String) uploadResult.get("secure_url");
            log.info("Foto de perfil subida a Cloudinary: {}", url);

            Miembro miembro = miembroRepository.findByCorreoMiembro(auth.getName())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            miembro.setFotoPerfil(url);
            miembroRepository.save(miembro);

            return ResponseEntity.ok(Map.of("url", url));

        } catch (Exception e) {
            log.error("Error al subir foto de perfil: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al subir la foto: " + e.getMessage()));
        }
    }

    @PostMapping("/evidencia")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadEvidencia(@RequestParam("file") MultipartFile file,
                                              @RequestParam("peticionId") String peticionId,
                                              Authentication auth) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Archivo vacío"));
        }

        try {
            var uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "pqrs-evidencias",
                            "resource_type", "auto"
                    )
            );

            String url = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");
            String nombreArchivo = file.getOriginalFilename();

            Miembro miembro = miembroRepository.findByCorreoMiembro(auth.getName())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            String subidaPor = "ADMIN".equals(miembro.getRol().name()) ? "ADMIN" : "RESIDENTE";

            Peticion peticion = peticionRepository.findById(peticionId)
                    .orElseThrow(() -> new RuntimeException("Petición no encontrada"));

            EvidenciaEmbedded evidencia = new EvidenciaEmbedded(
                    nombreArchivo, url, publicId, java.time.LocalDateTime.now()
            );
            evidencia.setSubidaPor(subidaPor);
            peticion.getEvidencias().add(evidencia);
            peticionRepository.save(peticion);

            return ResponseEntity.ok(Map.of(
                    "url", url,
                    "publicId", publicId,
                    "nombreArchivo", nombreArchivo
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al subir evidencia: " + e.getMessage()));
        }
    }
}
