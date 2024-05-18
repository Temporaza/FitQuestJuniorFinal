import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.page.html',
  styleUrls: ['./game-details.page.scss'],
})
export class GameDetailsPage implements OnInit {
  game: any; 

  constructor(
    private route: ActivatedRoute, private firestore: AngularFirestore
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const gameId = params.get('id');
      if (gameId) {
        // Fetch game details based on the game ID
        this.fetchGameDetails(gameId);
      }
    });
  }

  fetchGameDetails(gameId: string) {
    this.firestore.collection('games').doc(gameId).valueChanges().subscribe(
      (game: any) => {
        this.game = game;
      },
      error => {
        console.error('Error fetching game details:', error);
        // Handle the error (e.g., display a message to the user)
      }
    );
  }
}
