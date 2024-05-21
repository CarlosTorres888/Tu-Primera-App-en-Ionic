<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Camara</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
  <ion-fab vertical="bottom" horizontal="center" slot="fixed">
    <ion-fab-button @click="takePhoto()">
      <ion-icon :icon="camera"></ion-icon>
    </ion-fab-button>
  </ion-fab>
</ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  actionSheetController,
  IonPage,
  IonHeader,
  IonFab,
  IonFabButton,
  IonIcon,
  IonToolbar,
  IonTitle,
  IonContent,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/vue';
// other imports
import { camera, trash, close } from 'ionicons/icons';
import { usePhotoGallery, UserPhoto } from '@/composables/usePhotoGallery';

const { photos, takePhoto, deletePhoto } = usePhotoGallery();


</script>
