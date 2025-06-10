import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuotasService } from 'src/app/services/cuotasService/cuotas.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-pay',
    templateUrl: './pay.component.html',
    styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {
    @ViewChild('paymentForm') paymentForm!: NgForm;

    paymentData = {
        card_number: '',
        card_exp_year: '',
        card_exp_month: '',
        card_cvc: '',
        customer_name: '',
        customer_last_name: '',
        customer_email: '',
        customer_phone: '',
        customer_doc_number: ''
    };

    cuotaId: string = '';    constructor(private cuotasService: CuotasService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        const id = this.route.snapshot.params['id'];
        this.cuotaId = id;
        console.log('ID de la cuota:', id);
    }

    pay() {
        this.cuotasService.pay(this.cuotaId, this.paymentData).subscribe({
            next: (response) => {
                Swal.fire('Éxito', 'Pago procesado exitosamente.', 'success');
                console.log('Payment response:', response);
            },
            error: (error) => {
                Swal.fire('Error', 'Hubo un problema al procesar el pago.', 'error');
                console.error('Payment error:', error);
            }        });
    }

    onSubmit() {
        this.paymentData.card_number = this.paymentForm.value.cardNumber;
        this.paymentData.card_exp_month = this.paymentForm.value.expMonth;
        this.paymentData.card_exp_year = this.paymentForm.value.expYear;
        this.paymentData.card_cvc = this.paymentForm.value.cvc;

        this.paymentData.customer_name = this.paymentForm.value.customerName;
        this.paymentData.customer_last_name = this.paymentForm.value.lastName;
        this.paymentData.customer_email = this.paymentForm.value.email;
        this.paymentData.customer_phone = this.paymentForm.value.phone;
        this.paymentData.customer_doc_number = this.paymentForm.value.docNumber;

        console.log('Datos enviados:', this.paymentData);

        this.pay();
    }
}
