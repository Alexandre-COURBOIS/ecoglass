import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import * as mapboxgl from 'mapbox-gl';
import {HttpClient} from "@angular/common/http";
import {ContainersService} from "../../Services/containers.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  totalAngularPackages: any;
  // @ts-ignore
  private map: mapboxgl.Map;

  constructor(private containerService: ContainersService) {
  }

  ngOnInit(): void {
    this.containerService.getContainer().subscribe(value => {
      console.log(value);
    }, error => {
      console.log(error);
    })

    // @ts-ignore
    mapboxgl.accessToken = environment.mapBoxKey;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 5,
      center: [2.209667, 46.232193]
    });

    var marker = new mapboxgl.Marker()
      .setLngLat([4.863863, 45.690650999057])
      .setPopup(new mapboxgl.Popup({offset: 25}).setText(
        'Test'
      ))
      .addTo(this.map);
  }


}
