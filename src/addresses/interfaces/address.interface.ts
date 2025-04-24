// Interface pour l'API BAN (Base Adresse Nationale)
export interface BanResponse {
    type: string;
    version: string;
    features: BanFeature[];
    attribution: string;
    licence: string;
    query: string;
    limit: number;
  }
  
  export interface BanFeature {
    type: string;
    geometry: {
      type: string;
      coordinates: [number, number]; // [longitude, latitude]
    };
    properties: {
      label: string;
      score: number;
      housenumber: string;
      id?: string;
      name?: string;
      postcode: string;
      citycode: string;
      x: number;
      y: number;
      city: string;
      context: string;
      type: string;
      importance: number;
      street: string;
    };
  }
  

  export interface GeorisquesResponse {
    adresse: {
      libelle: string;
      longitude: number;
      latitude: number;
      };
      commune: {
      libelle: string;
      codePostal: string;
      codeInsee: string;
      };
      url: string;
      risquesNaturels: {
      inondation: {
        present: boolean;
        libelle: string;
      };
      risqueCotier: {
        present: boolean;
        libelle: string;
      };
      seisme: {
        present: boolean;
        libelle: string;
      };
      mouvementTerrain: {
        present: boolean;
        libelle: string;
      };
      reculTraitCote: {
        present: boolean;
        libelle: string;
      };
      retraitGonflementArgile: {
        present: boolean;
        libelle: string;
      };
      avalanche: {
        present: boolean;
        libelle: string;
      };
      feuForet: {
        present: boolean;
        libelle: string;
      };
      eruptionVolcanique: {
        present: boolean;
        libelle: string;
      };
      cyclone: {
        present: boolean;
        libelle: string;
      };
      radon: {
        present: boolean;
        libelle: string;
      };
      };
      risquesTechnologiques: {
      icpe: {
        present: boolean;
        libelle: string;
      };
      nucleaire: {
        present: boolean;
        libelle: string;
      };
      canalisationsMatieresDangereuses: {
        present: boolean;
        libelle: string;
      };
      pollutionSols: {
        present: boolean;
        libelle: string;
      };
      ruptureBarrage: {
        present: boolean;
        libelle: string;
      };
      risqueMinier: {
        present: boolean;
        libelle: string;
      };
      };
  }