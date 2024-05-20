import { ref, onMounted, watch } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { isPlatform } from '@ionic/vue';
import { Capacitor } from '@capacitor/core';

const photos = ref<UserPhoto[]>([]);
const PHOTO_STORAGE = 'photos';


export const usePhotoGallery = () => {
    const takePhoto = async () => {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });
      const fileName = Date.now() + '.jpeg';
     const savedFileImage = await savePicture(photo, fileName);

photos.value = [savedFileImage, ...photos.value];
    };
  
    return {
        photos,
        takePhoto,
      };
  };
  export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
  }

  const convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

    const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
        let base64Data: string | Blob;
        // El híbrido detectará dispositivos móviles: iOS o Android.
        if (isPlatform('hybrid')) {
          const file = await Filesystem.readFile({
            path: photo.path!,
          });
          base64Data = file.data;
        } else {
          // Se obtiene la foto, se leé como un blob y luego se conviérte al formato base64
          const response = await fetch(photo.webPath!);
          const blob = await response.blob();
          base64Data = (await convertBlobToBase64(blob)) as string;
        }
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Data,
        });
      
        if (isPlatform('hybrid')) {
          // Se muestra la nueva imagen reescribiendo la ruta 'file://' a HTTP
          // Details: https://ionicframework.com/docs/building/webview#file-protocol
          return {
            filepath: savedFile.uri,
            webviewPath: Capacitor.convertFileSrc(savedFile.uri),
          };
        } else {
          // Se tiliza webPath para mostrar la nueva imagen en lugar de base64 
          // ya que ya está cargada en la memoria
          return {
            filepath: fileName,
            webviewPath: photo.webPath,
          };
        }
      };

    //   Función cachePhotos que guarda el array de Photos como JSON
    
      const cachePhotos = () => {
        Preferences.set({
          key: PHOTO_STORAGE,
          value: JSON.stringify(photos.value),
          
        });
      };
      watch(photos, cachePhotos);

    //   función para recuperar los datos cuando se cargue la pestaña 2.
    // recupera los datos de las fotos de las Preferencias
    //  luego convierte los datos de cada foto al formato base64
    const loadSaved = async () => {
        const photoList = await Preferences.get({ key: PHOTO_STORAGE });
        const photosInPreferences = photoList.value ? JSON.parse(photoList.value) : [];
      
        // Si esta ejecutando en la web...
        if (!isPlatform('hybrid')) {
          for (const photo of photosInPreferences) {
            const file = await Filesystem.readFile({
              path: photo.filepath,
              directory: Directory.Data,
            });
            // Plataforma web solo: Carga las fotos como un dato base64 
            photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
          }
        }
      
        photos.value = photosInPreferences;
      };
    //   Dentro de la función usePhotoGallery
    //   se agrega la función onMounted y llama a loadSaved.
      onMounted(loadSaved);