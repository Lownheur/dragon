import { Injectable } from '@angular/core';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteStep {
  instruction: string;
  distance: number; // meters
  duration: number; // seconds
}

export interface RunningRoute {
  start: LatLng;
  end: LatLng;
  distance: number; // meters
  duration: number; // seconds (estimated)
  steps: RouteStep[];
  polyline: string; // encoded polyline for map display
}

export interface SportSuggestion {
  name: string;
  type: 'running' | 'cycling' | 'swimming' | 'gym' | 'yoga' | 'handstand' | 'stretching' | 'other';
  duration: number; // minutes
  intensity: 'low' | 'medium' | 'high';
  description: string;
  xpReward: number;
}

@Injectable({ providedIn: 'root' })
export class SportRouteService {
  private readonly osrmBaseUrl = 'https://router.project-osrm.org';

  /**
   * Get user's current geolocation
   */
  getCurrentPosition(): Promise<LatLng> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  /**
   * Get a running route using OSRM
   * @param start Starting point
   * @param distanceKm Distance in kilometers
   * @param type 'out_and_back' | 'loop'
   */
  async getRunningRoute(start: LatLng, distanceKm: number = 5, type: 'out_and_back' | 'loop' = 'loop'): Promise<RunningRoute> {
    const url = `${this.osrmBaseUrl}/route/v1/running/${start.lng},${start.lat}?overview=full&geometries=polyline&steps=true`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes?.[0]) {
      throw new Error('Route not found');
    }

    const route = data.routes[0];
    const leg = route.legs[0];

    const steps: RouteStep[] = (leg.steps || []).map((step: any) => ({
      instruction: step.maneuver?.type === 'depart' ? 'Start' : step.maneuver?.modifier ? `${step.maneuver.type} ${step.maneuver.modifier}` : step.maneuver?.type || 'Continue',
      distance: step.distance,
      duration: step.duration,
    }));

    return {
      start,
      end: { lat: route.geometry.coordinates[route.geometry.coordinates.length - 1][1], lng: route.geometry.coordinates[route.geometry.coordinates.length - 1][0] },
      distance: route.distance,
      duration: route.duration,
      steps,
      polyline: route.geometry,
    };
  }

  /**
   * Get a custom route between two points
   */
  async getRouteBetween(start: LatLng, end: LatLng): Promise<RunningRoute> {
    const url = `${this.osrmBaseUrl}/route/v1/running/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=polyline&steps=true`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes?.[0]) {
      throw new Error('Route not found');
    }

    const route = data.routes[0];
    const leg = route.legs[0];

    const steps: RouteStep[] = (leg.steps || []).map((step: any) => ({
      instruction: step.maneuver?.type === 'depart' ? 'Start' : step.maneuver?.modifier ? `${step.maneuver.type} ${step.maneuver.modifier}` : step.maneuver?.type || 'Continue',
      distance: step.distance,
      duration: step.duration,
    }));

    return {
      start,
      end,
      distance: route.distance,
      duration: route.duration,
      steps,
      polyline: route.geometry,
    };
  }

  /**
   * Format route as text instructions
   */
  formatRouteInstructions(route: RunningRoute): string {
    const km = (route.distance / 1000).toFixed(1);
    const mins = Math.round(route.duration / 60);
    let text = `🏃‍♂️ Course de ${km}km (~${mins} min)\n\n`;

    for (const step of route.steps) {
      const dist = step.distance < 1000 ? `${Math.round(step.distance)}m` : `${(step.distance / 1000).toFixed(1)}km`;
      text += `• ${step.instruction} (${dist})\n`;
    }

    text += `\n💪 Tu peux le faire !`;
    return text;
  }

  /**
   * Get sport suggestions based on objectives
   */
  getDefaultSuggestions(): SportSuggestion[] {
    return [
      { name: 'Course à pied', type: 'running', duration: 30, intensity: 'medium', description: 'Sortie course à pied moderate', xpReward: 50 },
      { name: 'Handstand practice', type: 'handstand', duration: 20, intensity: 'high', description: 'Pratique des handstands et控', xpReward: 40 },
      { name: 'Yoga matinal', type: 'yoga', duration: 30, intensity: 'low', description: 'Séance de yoga douce', xpReward: 30 },
      { name: 'Musculation', type: 'gym', duration: 45, intensity: 'high', description: 'Séance musculation complète', xpReward: 60 },
      { name: 'Natation', type: 'swimming', duration: 40, intensity: 'medium', description: 'Séance de natation', xpReward: 55 },
      { name: 'Vélo', type: 'cycling', duration: 60, intensity: 'medium', description: 'Sortie vélo', xpReward: 50 },
      { name: 'Étirements', type: 'stretching', duration: 15, intensity: 'low', description: 'Séance d\'étirements', xpReward: 20 },
    ];
  }
}
