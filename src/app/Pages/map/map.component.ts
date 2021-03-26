import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {environment} from "../../../environments/environment";
import * as mapboxgl from 'mapbox-gl';
// @ts-ignore
import * as MapBoxDirection from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import {ContainersService} from "../../Services/containers.service";
import * as turf from '@turf/turf';
// @ts-ignore
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  // @ts-ignore
  private map: mapboxgl.Map;
  @ViewChild('mapElement') mapElement!: ElementRef;
  private direction: MapBoxDirection;

  constructor(private containerService: ContainersService) {
  }

  ngOnInit(): void {
    this.containerService.getContainer().subscribe(value => {
      // @ts-ignore
      mapboxgl.accessToken = environment.mapBoxKey;

      this.direction = new MapBoxDirection({
        accessToken: environment.mapBoxKey,
        unit: 'metric',
        profile: 'mapbox/walking',
        controls: {
          inputs: true,
          instructions: true,
        },
        language: 'fr'
      });

      this.map = new mapboxgl.Map({
        container: this.mapElement.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 5,
        center: [2.209667, 46.232193]
      });
      this.map.addControl(this.direction);
      var geojson = {
        type: 'FeatureCollection',
        features: [],
        properties: {}
      }

      for (let i = 0; i < Object.keys(value).length; i++) {
        // @ts-ignore
        geojson.features.push({
          geometry: {
            // @ts-ignore
            type: 'Point',
            // @ts-ignore
            coordinates: [value[i].longitude, value[i].latitude]
          },
          properties: {
            // @ts-ignore
            street: value[i].street,
            // @ts-ignore
            postalCodeAndCity: value[i].postalCode + ' ' + value[i].city,
            // @ts-ignore
            id: i
          }
        });

      }
      navigator.geolocation.getCurrentPosition(position => {

        sessionStorage.setItem('userLng', String(position.coords.longitude));
        sessionStorage.setItem('userLat', String(position.coords.latitude));
      });

      geojson.features.forEach(function (container) {

        // @ts-ignore
        var distance = turf.distance(container.geometry.coordinates, [Number(sessionStorage.getItem('userLng')), Number(sessionStorage.getItem('userLat'))], {units: "kilometers"});

        // @ts-ignore
        Object.defineProperty(container.properties, 'distance', {
          // @ts-ignore
          value: distance.toFixed([2])

        });
      });

      geojson.features.sort(function (a, b) {
        // @ts-ignore
        if (a.properties.distance > b.properties.distance) {
          return 1;
        }
        // @ts-ignore
        if (a.properties.distance < b.properties.distance) {
          return -1;
        }
        return 0; // a must be equal to b
      });


      var listings = document.getElementById('listings');
      // @ts-ignore
      while (listings.firstChild) {
        // @ts-ignore
        listings.removeChild(listings.firstChild);
      }



      const buildListing = (data: { features: any[]; }) => {

        var dataSliced = data.features.slice(0, 5);
        dataSliced.forEach((container, i) => {

          var prop = container.properties;

          var listings = document.getElementById('listings');
          // @ts-ignore
          var listing = listings.appendChild(document.createElement('li'));
          listing.id = 'listing-' + prop.id;
          listing.className = 'list-group-item';

          var link = listing.appendChild(document.createElement('a'));

          link.className = 'card-link';
          link.id = 'linkContainer'
          link.innerHTML = prop.street;

          var details = listing.appendChild(document.createElement('div'));

          if (prop.distance) {
            var roundedDistance = Math.round(prop.distance * 100) / 100;
            details.innerHTML +=
              '<p><span class="text-muted">à ' + roundedDistance + ' km de chez vous</span></p>';
          }

          const flyToContainer = (currentFeature: { geometry: { coordinates: any; }; }) => {
            this.map.flyTo({
              center: currentFeature.geometry.coordinates,
              zoom: 15
            });
          }


          link.addEventListener('click', (e) => {
            var clickedListing = data.features[i];
            flyToContainer(clickedListing);

            var popup = new mapboxgl.Popup();
            const getThisDirection = () => {
              return this.direction;
            }
            popup.on('open', function () {
              if (navigator.geolocation) {
                // @ts-ignore
                var coordinates = clickedListing.geometry.coordinates.slice();
                var street = clickedListing.properties.street;
                var postalCodeAndCity = clickedListing.properties.postalCodeAndCity;

                if(postalCodeAndCity.includes('null')) {
                  postalCodeAndCity = " ";
                }
                if(street.includes('null')) {
                  street = " ";
                }

                var distance = turf.distance([coordinates[0], coordinates[1]], [Number(sessionStorage.getItem('userLng')), Number(sessionStorage.getItem('userLat'))], {units: "kilometers"});

                popup.setLngLat(coordinates)
                  .setHTML(
                    // @ts-ignore
                    '<div class="card" style="border:none !important;"><p class="h5 font-weight-bold text-center">' + street + '<br>' + postalCodeAndCity + '</p><p class="ml-1">' + 'à ' + distance.toFixed([2]) + ' km de chez vous</p>' +
                    '<button class="btn btn-success" id="btn">M\'y emmener <i class="fas fa-map-marker-alt"></i></button></div>'
                  )

                // @ts-ignore
                document.getElementById("btn").addEventListener("click", function () {
                  var directions = getThisDirection();
                  directions.setOrigin(Number(sessionStorage.getItem('userLng')) + ',' + Number(sessionStorage.getItem('userLat')))
                  directions.setDestination(coordinates)
                });
              } else {
                alert("Votre navigateur ne supporte pas la géolocalisation")
              }

            });

            popup.addTo(this.map);
          });

        });
      }

      buildListing(geojson);



      var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
        countries: 'fr'
      });

      // @ts-ignore
      document.getElementById('geocoder').appendChild(geocoder.onAdd(this.map));


      this.direction = new MapBoxDirection({
        accessToken: environment.mapBoxKey,
        unit: 'metric',
        profile: 'mapbox/cycling',
        language: 'fr',
        interactive: false
      });

      this.map.on('load', () => {

        this.map.loadImage(
          'assets/image/recycle.png',
          (error, image) => {
            if (error) throw error;
            // @ts-ignore
            this.map.addImage('recycling-bin', image);

            this.map.addControl(
              new mapboxgl.GeolocateControl({
                positionOptions: {
                  enableHighAccuracy: true
                },
                trackUserLocation: true
              })
            );

            this.map.addSource('containers', {
              type: 'geojson',
              // @ts-ignore
              data: geojson,
              cluster: true,
              clusterMaxZoom: 12,
              clusterRadius: 50
            });

            this.map.addLayer({
              id: 'clusters',
              type: 'circle',
              source: 'containers',
              filter: ['has', 'point_count'],
              paint: {
                'circle-color': [
                  'step',
                  ['get', 'point_count'],
                  '#51bbd6',
                  100,
                  '#f1f075',
                  750,
                  '#AADD08'
                ],
                'circle-radius': [
                  'step',
                  ['get', 'point_count'],
                  20,
                  100,
                  30,
                  750,
                  40
                ]
              }
            });

            this.map.addLayer({
              id: 'cluster-count',
              type: 'symbol',
              source: 'containers',
              filter: ['has', 'point_count'],
              layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
              }
            });

            this.map.addLayer({
              id: 'unclustered-point',
              type: 'symbol',
              source: 'containers',
              filter: ['!', ['has', 'point_count']],

              layout: {
                'icon-image': 'recycling-bin',
                'icon-size': 1,
              },
              paint: {}
            });

            this.map.on('click', 'clusters', (e) => {
              var features = this.map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
              });
              // @ts-ignore
              var clusterId = features[0].properties.cluster_id;
              // @ts-ignore
              this.map.getSource('containers').getClusterExpansionZoom(
                clusterId,
                (err: any, zoom: any) => {
                  if (err) return;

                  this.map.easeTo({
                    // @ts-ignore
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                  });
                }
              );
            });

            this.map.on('click', 'unclustered-point', (e) => {
              const getThisDirection = () => {
                return this.direction;
              }
              // @ts-ignore
              var coordinates = e.features[0].geometry.coordinates.slice();
              // @ts-ignore
              var postalCodeAndCity = e.features[0].properties.postalCodeAndCity;
              // @ts-ignore
              var street = e.features[0].properties.street;

              if(postalCodeAndCity.includes('null')) {
                postalCodeAndCity = " ";
              }
              if(street.includes('null')) {
                street = " ";
              }


              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              var popup = new mapboxgl.Popup();

              popup.on('open', function () {
                if (navigator.geolocation) {

                  var distance = turf.distance([coordinates[0], coordinates[1]], [Number(sessionStorage.getItem('userLng')), Number(sessionStorage.getItem('userLat'))], {units: "kilometers"});

                  popup.setLngLat(coordinates)
                    .setHTML(
                      // @ts-ignore
                      '<div class="card" style="border:none !important;"><p class="h5 font-weight-bold text-center">' + street + '<br>' + postalCodeAndCity + '</p><p class="ml-1">' + 'à ' + distance.toFixed([2]) + ' km de chez vous</p>' +
                      '<button class="btn btn-success" id="btn">M\'y emmener <i class="fas fa-map-marker-alt"></i></button></div>'
                    )

                  // @ts-ignore
                  document.getElementById("btn").addEventListener("click", function () {
                    var directions = getThisDirection();
                    directions.setOrigin(Number(sessionStorage.getItem('userLng')) + ',' + Number(sessionStorage.getItem('userLat')))
                    directions.setDestination(coordinates)
                  });
                } else {
                  alert("Votre navigateur ne supporte pas la géolocalisation")
                }

              });

              popup.addTo(this.map);
            });

            this.map.on('mouseenter', 'clusters', () => {
              this.map.getCanvas().style.cursor = 'pointer';
            });
            this.map.on('mouseleave', 'clusters', () => {
              this.map.getCanvas().style.cursor = '';
            });
          }
        )
      })


    }, error => {
      console.log(error);
    })
  };


}
