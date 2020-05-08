import { Component, OnInit } from '@angular/core';
import { PortalWeatherService } from 'src/app/servicios/portal-weather.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tiempo } from 'src/app/model/tiempo.model';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  infoTiempo: any;
  ciudadForm;
  tiempoActual: Tiempo = new Tiempo;

  ciudades: string[] = [
    'Santiago, Chile',
    'Nueva York, Estados Unidos',
    'Caracas, Venezuela',
    'Buenos Aires, Argentina'
  ];


  private tiempoSubs: Subscription;

  constructor(
    private servicio: PortalWeatherService,
    private snack: MatSnackBar
  ) { }


  ngOnInit(): void {

    this.ciudadForm = new FormGroup({
      nuevaCiudad: new FormControl('', Validators.required),
      nuevoPais: new FormControl('', Validators.required)
    });

  }

  agregarCiudad() {
    let nCiudad = this.ciudadForm.get('nuevaCiudad').value as string;
    nCiudad = nCiudad.charAt(0).toUpperCase() + nCiudad.slice(1);


    let nPais = this.ciudadForm.get('nuevoPais').value as string;
    nPais = nPais.charAt(0).toUpperCase() + nPais.slice(1);

    this.ciudades.push(`${nCiudad}, ${nPais}`);


    this.ciudadForm.setValue({
      nuevaCiudad: '',
      nuevoPais: ''
    });

    this.snack.open(`Se ha agregado ${nCiudad}, ${nPais}`, 'Cerrar', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['snackbar-exitoso']
    });

  }


  consultarTiempo(e: any) {

    let ciudadParametro: string = e.value;
    this.tiempoSubs = this.servicio.getInfo(ciudadParametro).subscribe(data => {
      this.infoTiempo = data;
      console.log("Traza 00: ", this.infoTiempo);
      console.log("Traza 01: ", this.infoTiempo.current_condition[0].temp_C);

      this.tiempoActual.ciudad = this.infoTiempo.request[0].query;
      this.tiempoActual.tiempo = this.infoTiempo.current_condition[0].weatherDesc[0].value;
      this.tiempoActual.temperatura = this.infoTiempo.current_condition[0].temp_C + ' Cº';
      this.tiempoActual.temperaturaMin = this.infoTiempo.weather[0].mintempC + ' Cº';
      this.tiempoActual.temperaturaMax = this.infoTiempo.weather[0].maxtempC + ' Cº';
      this.tiempoActual.hora = this.infoTiempo.current_condition[0].observation_time;
      this.tiempoActual.icono = this.infoTiempo.current_condition[0].weatherIconUrl[0].value;
    });
    
    

  }

}
