// src/app/shared/loading-util.ts
import $ from 'jquery';
export function toggleLoading(isLoading: boolean): void {
    const $loadingElement = $('#loadingSpinner'); // Utilizamos jQuery para seleccionar el elemento

    if ($loadingElement.length) {
      if (isLoading) {
        $loadingElement.css('display', 'flex');  // Muestra el spinner
      } else {
        $loadingElement.css('display', 'none');  // Oculta el spinner
      }
    } else {
      console.warn('Elemento con id "loadingSpinner" no encontrado');
    }
  }