package com.pablolopezlujan.tfggimnasio.exception.errores;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.Getter;
import lombok.Setter;

@SuppressWarnings("serial")
@ResponseStatus(value = HttpStatus.NOT_FOUND)
@Getter 
@Setter
public class ResourceNotFoundException extends RuntimeException {
	
	private String nombreRecurso;
    private String nombreCampo;
    private String valorCampo;
    
    public ResourceNotFoundException(String nombreRecurso, String nombreCampo, String valorCampo) {
        super(String.format("%s no encontrado con: %s : %s",nombreRecurso,nombreCampo,valorCampo));
        this.nombreRecurso = nombreRecurso;
        this.nombreCampo = nombreCampo;
        this.valorCampo = valorCampo;
    }

}
