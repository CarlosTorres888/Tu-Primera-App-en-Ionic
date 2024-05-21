<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Galeria</ion-title>
      </ion-toolbar>
    </ion-header>
    <!-- Galeria -->
<ion-content>
  <ion-grid>
    <ion-row>
      <ion-col size="4" :key="photo.filepath" v-for="photo in photos">
        <ion-img :src="photo.webviewPath" @click="showActionSheet(photo)"></ion-img>
      </ion-col>
    </ion-row>
  </ion-grid>

  <!-- <ion-fab> margen  -->
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

import { usePhotoGallery, UserPhoto } from '@/composables/usePhotoGallery';
import { camera, trash, close } from 'ionicons/icons';

const { photos, takePhoto, deletePhoto } = usePhotoGallery();

const showActionSheet = async (photo: UserPhoto) => {
  const actionSheet = await actionSheetController.create({
    header: 'Fotos',
    buttons: [
      {
        text: 'Borrar',
        role: 'destructive',
        icon: trash,
        handler: () => {
          deletePhoto(photo);
        },
      },
      {
        text: 'Cancelar',
        icon: close,
        role: 'cancel',
        handler: () => {
          // Nada que hacer, la hoja de acción se cierra automáticamente
        },
      },
    ],
  });
  await actionSheet.present();
};
</script>
