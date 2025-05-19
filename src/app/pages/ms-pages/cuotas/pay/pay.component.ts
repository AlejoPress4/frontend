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
        card: {
            number: '',
            exp_year: '',
            exp_month: '',
            cvc: ''
        },
        customer: {
            name: '',
            last_name: '',
            email: '',
            phone: '',
            doc_number: ''
        },
        due: {
            id: '',
            id_servicio: '',
            valor: ''
        },
        description: '',
        tax: '',
        tax_base: '',
        dues: ''
    };

    constructor(private cuotasService: CuotasService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        const id = this.route.snapshot.params['id'];
        this.paymentData.due.id = id; // Aseguramos que el ID sea el correcto
        console.log('ID de la cuota:', id); // Agregamos un log para verificar el ID
    }

    pay() {
        this.cuotasService.pay(this.paymentData).subscribe({
            next: (response) => {
                Swal.fire('Éxito', 'Pago procesado exitosamente.', 'success');
                console.log('Payment response:', response);
            },
            error: (error) => {
                Swal.fire('Error', 'Hubo un problema al procesar el pago.', 'error');
                console.error('Payment error:', error);
            }
        });
    }

    onSubmit() {
        this.paymentData.card.number = this.paymentForm.value.cardNumber;
        this.paymentData.card.exp_month = this.paymentForm.value.expMonth;
        this.paymentData.card.exp_year = this.paymentForm.value.expYear;
        this.paymentData.card.cvc = this.paymentForm.value.cvc;

        this.paymentData.customer.name = this.paymentForm.value.customerName;
        this.paymentData.customer.last_name = this.paymentForm.value.lastName;
        this.paymentData.customer.email = this.paymentForm.value.email;
        this.paymentData.customer.phone = this.paymentForm.value.phone;
        this.paymentData.customer.doc_number = this.paymentForm.value.docNumber;

        this.paymentData.due.id = this.paymentForm.value.due_id;
        this.paymentData.due.id_servicio = this.paymentForm.value.id_servicio;
        this.paymentData.due.valor = this.paymentForm.value.valor;

        this.paymentData.description = this.paymentForm.value.description;
        this.paymentData.tax = parseInt(this.paymentForm.value.tax, 10).toString();
        this.paymentData.tax_base = parseInt(this.paymentForm.value.taxBase, 10).toString();
        this.paymentData.dues = parseInt(this.paymentForm.value.dues, 10).toString();

        console.log('Datos enviados:', this.paymentData);

        this.pay();
    }
}
