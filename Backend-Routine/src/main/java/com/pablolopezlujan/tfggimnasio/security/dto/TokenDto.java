package com.pablolopezlujan.tfggimnasio.security.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TokenDto {

	private String token;

	public TokenDto() {
		super();
	}

	public TokenDto(String token) {
		super();
		this.token = token;
	}
	
	
}