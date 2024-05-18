import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './Guards/auth.guard';
import { AuthHomeParentGuard } from './Guards/auth-home-parent.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/signup/signup.module').then((m) => m.SignupPageModule),
  },
  {
    path: 'landing',
    loadChildren: () =>
      import('./pages/landing/landing.module').then((m) => m.LandingPageModule),
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./pages/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordPageModule
      ),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardPageModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfilePageModule),
  },
  {
    path: 'parent-login',
    loadChildren: () =>
      import('./ParentsPanel/parent-login/parent-login.module').then(
        (m) => m.ParentLoginPageModule
      ),
  },
  {
    path: 'parent-register',
    loadChildren: () =>
      import('./ParentsPanel/parent-register/parent-register.module').then(
        (m) => m.ParentRegisterPageModule
      ),
  },
  {
    path: 'home-parent',
    loadChildren: () =>
      import('./ParentsPanel/home-parent/home-parent.module').then(
        (m) => m.HomeParentPageModule
      ),
    canActivate: [AuthHomeParentGuard],
  },
  {
    path: 'kids-progress',
    loadChildren: () =>
      import('./ParentsPanel/kids-progress/kids-progress.module').then(
        (m) => m.KidsProgressPageModule
      ),
  },
  {
    path: 'consultation',
    loadChildren: () =>
      import('./ParentsPanel/consultation/consultation.module').then(
        (m) => m.ConsultationPageModule
      ),
  },
  {
    path: 'vaccination',
    loadChildren: () =>
      import('./ParentsPanel/vaccination/vaccination.module').then(
        (m) => m.VaccinationPageModule
      ),
  },
  {
    path: 'vaccine-details-modal',
    loadChildren: () =>
      import(
        './modals/vaccine-details-modal/vaccine-details-modal.module'
      ).then((m) => m.VaccineDetailsModalPageModule),
  },
  {
    path: 'market',
    loadChildren: () =>
      import('./pages/market/market.module').then((m) => m.MarketPageModule),
  },
  {
    path: 'activities',
    loadChildren: () =>
      import('./pages/activities/activities.module').then(
        (m) => m.ActivitiesPageModule
      ),
  },
  {
    path: 'parents-acitvity',
    loadChildren: () =>
      import('./ParentsPanel/parents-acitvity/parents-acitvity.module').then(
        (m) => m.ParentsAcitvityPageModule
      ),
  },
  {
    path: 'doctor-details-modal',
    loadChildren: () =>
      import('./modals/doctor-details-modal/doctor-details-modal.module').then(
        (m) => m.DoctorDetailsModalPageModule
      ),
  },
  {
    path: 'appointment',
    loadChildren: () =>
      import('./modals/appointment/appointment.module').then(
        (m) => m.AppointmentPageModule
      ),
  },
  {
    path: 'trash-game',
    loadChildren: () =>
      import('./pages/trash-game/trash-game.module').then(
        (m) => m.TrashGamePageModule
      ),
  },
  {
    path: 'welcome-modal-page',
    loadChildren: () =>
      import('./modals/welcome-modal-page/welcome-modal-page.module').then(
        (m) => m.WelcomeModalPagePageModule
      ),
  },
  {
    path: 'edit-user-modal',
    loadChildren: () =>
      import('./modals/edit-user-modal/edit-user-modal.module').then(
        (m) => m.EditUserModalPageModule
      ),
  },
  {
    path: 'addusermodal',
    loadChildren: () =>
      import('./modals/addusermodal/addusermodal.module').then(
        (m) => m.AddusermodalPageModule
      ),
  },
  {
    path: 'open-task-done-modal',
    loadChildren: () =>
      import('./modals/open-task-done-modal/open-task-done-modal.module').then(
        (m) => m.OpenTaskDoneModalPageModule
      ),
  },
  {
    path: 'search-games',
    loadChildren: () =>
      import('./pages/search-games/search-games.module').then(
        (m) => m.SearchGamesPageModule
      ),
  },
  {
    path: 'shape-match',
    loadChildren: () =>
      import('./pages/games/shape-match/shape-match.module').then(
        (m) => m.ShapeMatchPageModule
      ),
  },
  {
    path: 'game-details',
    loadChildren: () =>
      import('./modals/game-details/game-details.module').then(
        (m) => m.GameDetailsPageModule
      ),
  },
  {
    path: 'congratulatory',
    loadChildren: () =>
      import('./modals/congratulatory/congratulatory.module').then(
        (m) => m.CongratulatoryPageModule
      ),
  },
  {
    path: 'sound-animals',
    loadChildren: () =>
      import('./pages/games/sound-animals/sound-animals.module').then(
        (m) => m.SoundAnimalsPageModule
      ),
  },
  {
    path: 'bmi-diff',
    loadChildren: () =>
      import('./modals/bmi-diff/bmi-diff.module').then(
        (m) => m.BmiDiffPageModule
      ),
  },
  {
    path: 'modal-calendar',
    loadChildren: () =>
      import('./modals/modal-calendar/modal-calendar.module').then(
        (m) => m.ModalCalendarPageModule
      ),
  },
  {
    path: 'babybook',
    loadChildren: () =>
      import('./ParentsPanel/babybook/babybook.module').then(
        (m) => m.BabybookPageModule
      ),
  },
  {
    path: 'numbers',
    loadChildren: () =>
      import('./pages/games/numbers/numbers.module').then(
        (m) => m.NumbersPageModule
      ),
  },
  {
    path: 'admin-panel',
    loadChildren: () =>
      import('./admin/admin-panel/admin-panel.module').then(
        (m) => m.AdminPanelPageModule
      ),
  },
  {
    path: 'admin-home',
    loadChildren: () =>
      import('./admin/admin-home/admin-home.module').then(
        (m) => m.AdminHomePageModule
      ),
  },
  {
    path: 'parent-details-modal',
    loadChildren: () =>
      import(
        './admin/adminModals/parent-details-modal/parent-details-modal.module'
      ).then((m) => m.ParentDetailsModalPageModule),
  },
  {
    path: 'users-details-modal',
    loadChildren: () =>
      import(
        './admin/adminModals/users-details-modal/users-details-modal.module'
      ).then((m) => m.UsersDetailsModalPageModule),
  },
  {
    path: 'game-counting',
    loadChildren: () =>
      import('./pages/games/game-counting/game-counting.module').then(
        (m) => m.GameCountingPageModule
      ),
  },
  {
    path: 'custom-navigation',
    loadChildren: () =>
      import('./component/custom-navigation/custom-navigation.module').then(
        (m) => m.CustomNavigationPageModule
      ),
  },
  {
    path: 'parents-profile-page',
    loadChildren: () =>
      import('./modals/parents-profile-page/parents-profile-page.module').then(
        (m) => m.ParentsProfilePagePageModule
      ),
  },
  {
    path: 'trash',
    loadChildren: () =>
      import('./pages/trash/trash.module').then((m) => m.TrashPageModule),
  },
  {
    path: 'email-verification-required',
    loadChildren: () =>
      import(
        './ParentsPanel/email-verification-required/email-verification-required.module'
      ).then((m) => m.EmailVerificationRequiredPageModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./ParentsPanel/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: 'data-privacy',
    loadChildren: () =>
      import('./modals/data-privacy/data-privacy.module').then(
        (m) => m.DataPrivacyPageModule
      ),
  },
  {
    path: 'exercise-explanation',
    loadChildren: () =>
      import('./modals/exercise-explanation/exercise-explanation.module').then(
        (m) => m.ExerciseExplanationPageModule
      ),
  },
  {
    path: 'guest-game',
    loadChildren: () => import('./pages/games/guest-game/guest-game.module').then( m => m.GuestGamePageModule)
  },
  {
    path: 'guest-the-numbers',
    loadChildren: () => import('./pages/games/guest-the-numbers/guest-the-numbers.module').then( m => m.GuestTheNumbersPageModule)
  },
  {
    path: 'guest-the-colors',
    loadChildren: () => import('./pages/games/guest-the-colors/guest-the-colors.module').then( m => m.GuestTheColorsPageModule)
  },
  {
    path: 'birthday-modal',
    loadChildren: () => import('./modals/birthday-modal/birthday-modal.module').then( m => m.BirthdayModalPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
