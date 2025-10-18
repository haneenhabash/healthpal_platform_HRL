#include <stdio.h>
#include <stdlib.h>
#include <immintrin.h>
#include <time.h>

#define ITERATIONS 10
#define DATA float
const int SIZE = 512;

DATA __attribute__((aligned(16))) A[SIZE][SIZE];
DATA __attribute__((aligned(16))) B[SIZE][SIZE];
DATA __attribute__((aligned(16))) C[SIZE][SIZE];
DATA __attribute__((aligned(16))) vector[SIZE];
DATA __attribute__((aligned(16))) result[SIZE];

void initialize_matrix(DATA mat[][SIZE]) {
    for(int i = 0; i < SIZE; i++) {
        for(int j = 0; j < SIZE; j++) {
            mat[i][j] = (float)rand() / RAND_MAX;
        }
    }
}

void initialize_array(DATA *vec) {
    for(int i = 0; i < SIZE; i++) {
        vec[i] = (float)rand() / RAND_MAX;
    }
}

DATA vec(DATA *s1, DATA *s2, int size) {
    DATA prod = 0;
    for(int i = 0; i < size; i++) {
        prod += s1[i] * s2[i];
    }
    return prod;
}

DATA vec_sse(DATA *m1, DATA *m2, int size) {
    __m128 sum = _mm_setzero_ps();
    for(int i = 0; i < size; i += 4) {
        __m128 a = _mm_loadu_ps(&m1[i]);
        __m128 b = _mm_loadu_ps(&m2[i]);
        sum = _mm_add_ps(sum, _mm_mul_ps(a, b));
    }
    sum = _mm_hadd_ps(sum, sum);
    sum = _mm_hadd_ps(sum, sum);
    return _mm_cvtss_f32(sum);
}

void matvec_scalar(DATA matrix[][SIZE], DATA *vector, DATA *result) {
    for(int i = 0; i < SIZE; i++) {
        DATA sum = 0.0f;
        for(int j = 0; j < SIZE; j++) {
            sum += matrix[i][j] * vector[j];
        }
        result[i] = sum;
    }
}

void matvec_sse(DATA matrix[][SIZE], DATA *vector, DATA *result) {
    for(int i = 0; i < SIZE; i++) {
        __m128 sum = _mm_setzero_ps();
        for(int j = 0; j < SIZE; j += 4) {
            __m128 mat_row = _mm_loadu_ps(&matrix[i][j]);
            __m128 vec     = _mm_loadu_ps(&vector[j]);
            sum = _mm_add_ps(sum, _mm_mul_ps(mat_row, vec));
        }
        sum = _mm_hadd_ps(sum, sum);
        sum = _mm_hadd_ps(sum, sum);
        _mm_store_ss(&result[i], sum);
    }
}

void matmul_scalar(DATA A[][SIZE], DATA B[][SIZE], DATA C[][SIZE]) {
    for(int i = 0; i < SIZE; i++) {
        for(int j = 0; j < SIZE; j++) {
            C[i][j] = 0;
            for(int k = 0; k < SIZE; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
}

void matmul_sse(DATA A[][SIZE], DATA B[][SIZE], DATA C[][SIZE]) {
    for(int i = 0; i < SIZE; i++) {
        for(int j = 0; j < SIZE; j += 4) {
            _mm_store_ps(&C[i][j], _mm_setzero_ps());
        }
    }

    for(int i = 0; i < SIZE; i++) {
        for(int k = 0; k < SIZE; k++) {
            __m128 a = _mm_set1_ps(A[i][k]);
            for(int j = 0; j < SIZE; j += 4) {
                __m128 b = _mm_loadu_ps(&B[k][j]);
                __m128 c = _mm_loadu_ps(&C[i][j]);
                c = _mm_add_ps(c, _mm_mul_ps(a, b));
                _mm_storeu_ps(&C[i][j], c);
            }
        }
    }
}

double seconds() {
    struct timespec now;
    clock_gettime(CLOCK_MONOTONIC, &now);
    return now.tv_sec + now.tv_nsec / 1e9;
}

int main() {
    srand(time(NULL));

    initialize_matrix(A);
    initialize_matrix(B);
    initialize_array(vector);

    double start, end, elapsed;
    DATA dot_result;

    printf("Vector-Vector Dot Product:\n");
    start = seconds();
    for (int i = 0; i < ITERATIONS; i++) {
        dot_result = vec(vector, vector, SIZE);
    }
    elapsed = (seconds() - start) / ITERATIONS;
    printf("  Scalar: Result = %.10lf, Time = %.10lf sec\n", (double)dot_result, elapsed);

    start = seconds();
    for (int i = 0; i < ITERATIONS; i++) {
        dot_result = vec_sse(vector, vector, SIZE);
    }
    elapsed = (seconds() - start) / ITERATIONS;
    printf("  SSE:    Result = %.10lf, Time = %.10lf sec\n", (double)dot_result, elapsed);

    printf("\nMatrix-Vector Multiplication:\n");
    start = seconds();
    for (int i = 0; i < ITERATIONS; i++) {
        matvec_scalar(A, vector, result);
    }
    elapsed = (seconds() - start) / ITERATIONS;
    printf("  Scalar: Time = %.10lf sec\n", elapsed);

    start = seconds();
    for (int i = 0; i < ITERATIONS; i++) {
        matvec_sse(A, vector, result);
    }
    elapsed = (seconds() - start) / ITERATIONS;
    printf("  SSE:    Time = %.10lf sec\n", elapsed);

    printf("\nMatrix-Matrix Multiplication:\n");
    start = seconds();
    for (int i = 0; i < ITERATIONS; i++) {
        matmul_scalar(A, B, C);
    }
    elapsed = (seconds() - start) / ITERATIONS;
    printf("  Scalar: Time = %.10lf sec\n", elapsed);

    start = seconds();
    for (int i = 0; i < ITERATIONS; i++) {
        matmul_sse(A, B, C);
    }
    elapsed = (seconds() - start) / ITERATIONS;
    printf("  SSE:    Time = %.10lf sec\n", elapsed);

    return 0;
}