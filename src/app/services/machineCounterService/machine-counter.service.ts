import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MachineCounterService {
  private readonly STORAGE_KEY = 'machine_endpoints_counter';
  private counterSubject = new BehaviorSubject<number>(0);
  
  constructor() {
    // Cargar contador inicial desde localStorage
    this.loadCounterFromStorage();
  }

  /**
   * Observable para suscribirse a cambios del contador
   */
  get counter$(): Observable<number> {
    return this.counterSubject.asObservable();
  }

  /**
   * Obtener el valor actual del contador
   */
  get currentCount(): number {
    return this.counterSubject.value;
  }

  /**
   * Incrementar el contador cuando se llame a un endpoint de máquinas
   */
  incrementCounter(): void {
    const newCount = this.currentCount + 1;
    this.counterSubject.next(newCount);
    this.saveCounterToStorage(newCount);
    console.log(`Contador de endpoints de máquinas: ${newCount}`);
  }

  /**
   * Resetear el contador (opcional, por si lo necesitas)
   */
  resetCounter(): void {
    this.counterSubject.next(0);
    this.saveCounterToStorage(0);
    console.log('Contador de endpoints de máquinas reseteado');
  }

  /**
   * Cargar contador desde localStorage
   */
  private loadCounterFromStorage(): void {
    try {
      const savedCount = localStorage.getItem(this.STORAGE_KEY);
      if (savedCount) {
        const count = parseInt(savedCount, 10);
        if (!isNaN(count)) {
          this.counterSubject.next(count);
        }
      }
    } catch (error) {
      console.error('Error cargando contador desde localStorage:', error);
    }
  }
  /**
   * Guardar contador en localStorage
   */
  private saveCounterToStorage(count: number): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, count.toString());
      console.log(`💾 Contador guardado en localStorage: ${count}`);
    } catch (error) {
      console.error('Error guardando contador en localStorage:', error);
    }
  }
}