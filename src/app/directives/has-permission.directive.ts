import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthorizationService } from '../services/authorizationService/authorization.service';
import { SeguridadService } from '../services/seguridadService/seguridad.service';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  
  // New URL + method structure
  @Input() appHasPermission: string = ''; // URL path
  @Input() appHasPermissionMethod: string = 'GET'; // HTTP method
  @Input() appHasPermissionRole: string = ''; // Role name

  private subscription: Subscription = new Subscription();

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthorizationService,
    private seguridadService: SeguridadService
  ) { }

  ngOnInit() {
    this.updateView();
    
    // Subscribe to user changes
    this.subscription = this.seguridadService.getUsuario().subscribe(() => {
      this.updateView();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private updateView() {
    this.viewContainer.clear();
    
    let hasAccess = false;

    try {
      // Check by specific role
      if (this.appHasPermissionRole) {
        const currentRole = this.authService.getCurrentUserRole();
        hasAccess = currentRole?.toLowerCase() === this.appHasPermissionRole.toLowerCase();
        console.log(`[HasPermissionDirective] Role check - Required: ${this.appHasPermissionRole}, Current: ${currentRole}, HasAccess: ${hasAccess}`);
      }
      // Check by specific permission (URL + method)
      else if (this.appHasPermission) {
        hasAccess = this.authService.hasPermission(this.appHasPermission, this.appHasPermissionMethod);
        console.log(`[HasPermissionDirective] Permission check - URL: ${this.appHasPermission}, Method: ${this.appHasPermissionMethod}, HasAccess: ${hasAccess}`);
      }
      else {
        console.warn('[HasPermissionDirective] No permission criteria specified');
      }
    } catch (error) {
      console.error('[HasPermissionDirective] Error checking permissions:', error);
      hasAccess = false;
    }

    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
