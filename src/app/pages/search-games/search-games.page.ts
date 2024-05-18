import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryDocumentSnapshot,
  DocumentData,
} from '@angular/fire/compat/firestore';

interface UserData {
  age?: number; // Adjust the type according to your actual data structure
  // Add other fields as needed
}

interface Game {
  id: string;
  title: string;
  description: string;
  ageRating: number;
  minAge: number;
  maxAge: number;
  // Add other game properties as needed
}

@Component({
  selector: 'app-search-games',
  templateUrl: './search-games.page.html',
  styleUrls: ['./search-games.page.scss'],
})
export class SearchGamesPage implements OnInit {
  usersUID: string;
  agePreference: number;
  foundGames: Game[];
  buttonClicked: boolean = false;

  // Explicitly type the Firestore collection
  private gamesCollection: AngularFirestoreCollection<Game>;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    // Initialize the games collection
    this.gamesCollection = this.firestore.collection<Game>('games');
  }

  ngOnInit() {
    // Fetch current user data when the component initializes
    this.fetchCurrentUserData();
  }

  fetchCurrentUserData() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        // The user is logged in, get the UID
        this.usersUID = user.uid;

        // Fetch user data from Firestore based on the UID
        this.fetchUserData(this.usersUID);
      } else {
        console.error('No user is logged in.');
      }
    });
  }

  async fetchUserData(usersUID: string) {
    try {
      const userDoc = await this.firestore
        .collection('users')
        .doc(usersUID)
        .get()
        .toPromise();

      if (userDoc.exists) {
        // Cast userData to the defined interface UserData
        const userData = userDoc.data() as UserData;

        // Extract age from user data and set it to agePreference
        this.agePreference = userData.age || null;

        console.log('User Data:', userData);

        // Don't proceed with finding games here, do it only when the button is clicked
      } else {
        console.error('User document not found.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
  findGames() {
    if (this.usersUID && this.agePreference) {
      console.log('Current User Age:', this.agePreference);

      const collectionRef = this.gamesCollection.ref;

      // Query games where user's age matches minAge exactly
      const exactMinAgeQuery = collectionRef
        .where('minAge', '==', this.agePreference)
        .get();

      // Query games where user's age matches maxAge exactly
      const exactMaxAgeQuery = collectionRef
        .where('maxAge', '==', this.agePreference)
        .get();

      // Combine the results of the two queries
      Promise.all([exactMinAgeQuery, exactMaxAgeQuery])
        .then((querySnapshots) => {
          const foundGames: Game[] = [];

          querySnapshots.forEach((querySnapshot) => {
            if (!querySnapshot.empty) {
              const games = querySnapshot.docs.map(
                (doc) => ({ id: doc.id, ...doc.data() } as Game)
              );
              foundGames.push(...games);
            }
          });

          if (foundGames.length > 0) {
            console.log('Found Games:', foundGames);
            this.foundGames = foundGames;
            this.displayMatchingGames();
          } else {
            console.log('No games found for the specified age range.');
          }

          this.buttonClicked = true;
        })
        .catch((error) => {
          console.error('Error finding games:', error);
        });
    } else {
      console.error('Invalid user or age preference.');
    }
    this.playButtonClickSound();
  }

  displayMatchingGames() {
    const matchingGames = this.foundGames.filter(
      (game) =>
        game.minAge <= this.agePreference && game.maxAge >= this.agePreference
    );

    matchingGames.forEach((game) => {
      console.log('Matching Game Title:', game.title);
      console.log('Matching Game Description:', game.description);
    });
  }

  playButtonClickSound() {
    const audio = new Audio();
    audio.src = 'assets/btn-sound.mp3';
    audio.load();
    audio.play();
  }
}
