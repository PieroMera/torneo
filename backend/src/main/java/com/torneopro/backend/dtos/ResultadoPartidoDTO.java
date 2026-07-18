package com.torneopro.backend.dtos;

import lombok.Data;

@Data
public class ResultadoPartidoDTO {
    private Long equipoLocalId;
    private int golesLocal;
    private Long equipoVisitanteId;
    private int golesVisitante;
}
