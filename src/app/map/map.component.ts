import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { VeloService } from '../services/velo.service';
import 'leaflet.markercluster';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  standalone: true,
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map!: L.Map;

  constructor(private veloService: VeloService, private router: Router) {}

  ngOnInit(): void {
    this.initMap();

    const state = window.history.state as {
      latitude: number;
      longitude: number;
      nom: string;
    };

    if (state && state.latitude && state.longitude) {
      this.map.setView([state.latitude, state.longitude], 17);
    }
  }

  private initMap(): void {
    const center = { lat: 47.37, lng: 0.7 };
    this.map = L.map('map').setView(center, 13).setZoom(11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const iconDefault = L.icon({
      iconUrl: 'assets/marker-icon.png',
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const markers = L.markerClusterGroup({
      iconCreateFunction: function(cluster) {
        return L.divIcon({
          html: `<div style="background-color: rgba(0,128,255,0.61); color: black; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white;">${cluster.getChildCount()}</div>`,
          className: 'marker-cluster-custom',
          iconSize: L.point(40, 40, true)
        });
      },
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true
    });

    this.veloService.getVelosWithCoordonnees().subscribe(velos => {
      velos.forEach(velo => {
        markers.addLayer(
          L.marker([velo.latitude, velo.longitude], { icon: iconDefault })
            .bindPopup(`<b>${velo.nom}</b><br>Quantité: ${velo.quantite}`)
        );
      });
      this.map.addLayer(markers);
    });
  }
}
