function SumarBinarios(bin1, bin2) {
    // Validar que solo contenga 0 y 1
    if (!/^[01]+$/.test(bin1) || !/^[01]+$/.test(bin2)) {
        return "Valor inválido: no es un binario válido";
    }

    // Ajustar longitudes agregando ceros a la izquierda
    let maxLen = Math.max(bin1.length, bin2.length);
    bin1 = bin1.padStart(maxLen, "0");
    bin2 = bin2.padStart(maxLen, "0");

    let carry = 0;
    let resultado = "";

    for (let i = maxLen - 1; i >= 0; i--) {
        let bit1 = parseInt(bin1[i]);
        let bit2 = parseInt(bin2[i]);
        let suma = bit1 + bit2 + carry;

        let resultadoBit = suma % 2;
        carry = Math.floor(suma / 2);

        resultado = resultadoBit + resultado;
    }

    // Si queda carry al final
    if (carry === 1) {
        resultado = "1" + resultado;
    }

    return resultado;
}

function MultiplicarBinarios(bin1, bin2) {
    if (!/^[01]+$/.test(bin1) || !/^[01]+$/.test(bin2)) {
        return "Valor inválido: no es un binario válido";
    }

    let resultado = "0";

    // Recorremos bin2 de derecha a izquierda
    for (let i = bin2.length - 1; i >= 0; i--) {
        if (bin2[i] === "1") {
            // Desplazar bin1 según la posición del bit
            let parcial = bin1 + "0".repeat(bin2.length - 1 - i);

            // Ajustamos longitudes antes de sumar
            let maxLen = Math.max(resultado.length, parcial.length);
            resultado = resultado.padStart(maxLen, "0");
            parcial = parcial.padStart(maxLen, "0");

            // Sumamos el parcial
            resultado = SumarBinarios(resultado, parcial);
        }
    }

    // Quitamos ceros a la izquierda
    return resultado.replace(/^0+/, "") || "0";
}

function DividirBinarios(bin1, bin2) {
    // Validar que los valores sean binarios válidos
    if (!/^[01]+$/.test(bin1) || !/^[01]+$/.test(bin2)) {
        return "Valor inválido: no es un binario válido";
    }
    // Validar división por cero
    if (/^0+$/.test(bin2)) {
        return "Error: División por cero";
    }

    // Si bin1 es menor que bin2, el cociente es 0
    if (CompararBinarios(bin1, bin2) < 0) {
        return "0";
    }

    let cociente = "";
    let residuo = "";

    // Algoritmo de división binaria
    for (let i = 0; i < bin1.length; i++) {
        residuo += bin1[i]; // Agregar el siguiente bit
        residuo = residuo.replace(/^0+/, "") || "0"; // Quitar ceros a la izquierda

        // Si el residuo es mayor o igual que el divisor, restar
        if (CompararBinarios(residuo, bin2) >= 0) {
            residuo = RestarBinarios(residuo, bin2);
            cociente += "1";
        } else {
            // Solo agregar "0" al cociente si ya hemos agregado algo
            if (cociente !== "") {
                cociente += "0";
            }
        }
    }

    // Limpiar ceros a la izquierda
    return cociente.replace(/^0+/, "") || "0";
}

// Funciones auxiliares
function CompararBinarios(bin1, bin2) {
    bin1 = bin1.replace(/^0+/, "") || "0";
    bin2 = bin2.replace(/^0+/, "") || "0";

    if (bin1.length > bin2.length) return 1;
    if (bin1.length < bin2.length) return -1;

    for (let i = 0; i < bin1.length; i++) {
        if (bin1[i] > bin2[i]) return 1;
        if (bin1[i] < bin2[i]) return -1;
    }
    return 0;
}

function RestarBinarios(bin1, bin2) {
    let maxLen = Math.max(bin1.length, bin2.length);
    bin1 = bin1.padStart(maxLen, '0');
    bin2 = bin2.padStart(maxLen, '0');

    let borrow = 0;
    let resultado = "";

    for (let i = maxLen - 1; i >= 0; i--) {
        let bit1 = parseInt(bin1[i]);
        let bit2 = parseInt(bin2[i]);

        bit1 -= borrow;
        if (bit1 < bit2) {
            bit1 += 2;
            borrow = 1;
        } else {
            borrow = 0;
        }

        resultado = (bit1 - bit2) + resultado;
    }

    return resultado.replace(/^0+/, '') || '0';
}

// Limitar input a 0 y 1
$('#oneBinario, #twoBinario').on('input', function () {
    $(this).val($(this).val().replace(/[^01]/g, ''));

    // Quitar mensaje de error al escribir si es válido
    if ($(this).val() !== "") {
        if (this.id === 'oneBinario') $('#errorOne').addClass('d-none');
        if (this.id === 'twoBinario') $('#errorTwo').addClass('d-none');
    }
});

// Limpiamos los campos al cambiar de opción y en el btn de reiniciar
$("#accion").on("change", function () {
    $("#oneBinario").val("");
    $("#twoBinario").val("");
    $("#resultado").val("");
});

$("#btnReseat").on("click", function () {
    $("#oneBinario").val("");
    $("#twoBinario").val("");
    $("#resultado").val("");
    $('#errorOne').addClass('d-none');
    $('#errorTwo').addClass('d-none');
});

$('#btnCalcular').on('click', function () {
    let tipoAccion = $("#accion").val();
    let one = $('#oneBinario').val().trim();
    let two = $('#twoBinario').val().trim();

    // Validación de vacío
  
    if(tipoAccion===null){
         Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No ha seleccionado qué acción desea realizar, ¡verifique por favor!",
            });
    }
    if (one === "") {
        $('#errorOne').removeClass('d-none').text("Este campo no puede estar vacío");
    } else if (/[^01]/.test(one)) {
        $('#errorOne').removeClass('d-none').text("Solo se permiten 0 y 1");
    } else {
        $('#errorOne').addClass('d-none');
    }

    if (two === "") {
        $('#errorTwo').removeClass('d-none').text("Este campo no puede estar vacío");
    } else if (/[^01]/.test(two)) {
        $('#errorTwo').removeClass('d-none').text("Solo se permiten 0 y 1");
    } else {
        $('#errorTwo').addClass('d-none');
    }

    // Si ambos campos son válidos
    if ( tipoAccion!==null || one !== "" && two !== "" && !/[^01]/.test(one) && !/[^01]/.test(two)) {
        let resultado;
        if (tipoAccion === "1") {
            resultado = SumarBinarios(one, two);
        } else if (tipoAccion === "2") {
            resultado = RestarBinarios(one, two);
        } else if (tipoAccion === "3") {
            resultado = MultiplicarBinarios(one, two);
        } else if (tipoAccion === "4") {
            resultado = DividirBinarios(one, two);
        }

        // Mostrar el resultado o manejar errores
        $("#resultado").val(resultado);
    }
});