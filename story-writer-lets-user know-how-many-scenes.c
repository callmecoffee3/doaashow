#include <stdio.h>
#include <string.h>

#define MAX_ACTS 300
#define MAX_SCENE_LENGTH 100

typedef struct {
    char content[MAX_SCENE_LENGTH];
} Scene;

typedef struct {
    Scene scene;
} Act;

Act acts[MAX_ACTS];
int numActs = 0;

void displayMenu() {
    printf("Play Menu:\n");
    printf("You have entered %d out of 300 acts.\n", numActs);
    printf("1. Add Act\n");
    printf("2. View Acts\n");
    printf("3. Play Acts\n");
    printf("4. Exit\n");
}

void addAct() {
    if (numActs < MAX_ACTS) {
        printf("Enter act content: ");
        fgets(acts[numActs].scene.content, MAX_SCENE_LENGTH, stdin);
        acts[numActs].scene.content[strcspn(acts[numActs].scene.content, "\n")] = 0;
        numActs++;
        printf("Act added successfully!\n");
    } else {
        printf("You have already entered all 300 acts.\n");
    }
}

void viewActs() {
    printf("Acts:\n");
    for (int i = 0; i < numActs; i++) {
        printf("Act %d: %s\n", i + 1, acts[i].scene.content);
    }
}

void playActs() {
    if (numActs == MAX_ACTS) {
        printf("Playing acts...\n");
        for (int i = 0; i < numActs; i++) {
            printf("Act %d: %s\n", i + 1, acts[i].scene.content);
        }
    } else {
        printf("You need to enter all 300 acts before playing.\n");
    }
}

int main() {
    printf("Welcome! You need to enter 300 acts.\n");
    while (1) {
        displayMenu();
        int choice;
        printf("Enter your choice: ");
        scanf("%d", &choice);
        getchar();

        switch (choice) {
            case 1:
                addAct();
                break;
            case 2:
                viewActs();
                break;
            case 3:
                playActs();
                break;
            case 4:
                printf("Goodbye!\n");
                return 0;
            default:
                printf("Invalid choice!\n");
        }
    }

    return 0;
}