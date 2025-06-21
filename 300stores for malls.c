#include <stdio.h>
#include <string.h>

#define MAX_STORES 300
#define MAX_STORE_NAME 100

typedef struct {
    char name[MAX_STORE_NAME];
} Store;

Store stores[MAX_STORES];
int numStores = 0;

void addStore() {
    if (numStores < MAX_STORES) {
        printf("Enter store name: ");
        fgets(stores[numStores].name, MAX_STORE_NAME, stdin);
        stores[numStores].name[strcspn(stores[numStores].name, "\n")] = 0;
        numStores++;
        printf("Store added successfully!\n");
    } else {
        printf("Maximum number of stores reached!\n");
    }
}

void displayStores() {
    printf("Stores in the mall:\n");
    for (int i = 0; i < numStores; i++) {
        printf("%d. %s\n", i + 1, stores[i].name);
    }
}

int main() {
    while (1) {
        printf("Mall Store Management\n");
        printf("1. Add Store\n");
        printf("2. Display Stores\n");
        printf("3. Exit\n");
        int choice;
        printf("Enter your choice: ");
        scanf("%d", &choice);
        getchar();

        switch (choice) {
            case 1:
                addStore();
                break;
            case 2:
                displayStores();
                break;
            case 3:
                printf("Goodbye!\n");
                return 0;
            default:
                printf("Invalid choice!\n");
        }
    }

    return 0;
}
