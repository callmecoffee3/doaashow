#include <stdio.h>
#include <string.h>

#define MAX_SCENES 10
#define MAX_CHARACTERS 10
#define MAX_OPTIONS 5
#define MAX_INPUT_LENGTH 100

typedef struct {
    char content[MAX_INPUT_LENGTH];
} Scene;

typedef struct {
    char name[MAX_INPUT_LENGTH];
} Character;

typedef struct {
    char option[MAX_INPUT_LENGTH];
} Option;

void displayMenu() {
    printf("Play Menu:\n");
    printf("1. Add Scene\n");
    printf("2. Add Character\n");
    printf("3. Add Option\n");
    printf("4. View Scenes\n");
    printf("5. View Characters\n");
    printf("6. View Options\n");
    printf("7. Play\n");
    printf("8. Exit\n");
}

void addScene(Scene scenes[], int *numScenes) {
    printf("Enter scene content: ");
    fgets(scenes[*numScenes].content, MAX_INPUT_LENGTH, stdin);
    scenes[*numScenes].content[strcspn(scenes[*numScenes].content, "\n")] = 0;
    (*numScenes)++;
}

void addCharacter(Character characters[], int *numCharacters) {
    printf("Enter character name: ");
    fgets(characters[*numCharacters].name, MAX_INPUT_LENGTH, stdin);
    characters[*numCharacters].name[strcspn(characters[*numCharacters].name, "\n")] = 0;
    (*numCharacters)++;
}

void addOption(Option options[], int *numOptions) {
    printf("Enter option: ");
    fgets(options[*numOptions].option, MAX_INPUT_LENGTH, stdin);
    options[*numOptions].option[strcspn(options[*numOptions].option, "\n")] = 0;
    (*numOptions)++;
}

void viewScenes(Scene scenes[], int numScenes) {
    printf("Scenes:\n");
    for (int i = 0; i < numScenes; i++) {
        printf("%s\n", scenes[i].content);
    }
}

void viewCharacters(Character characters[], int numCharacters) {
    printf("Characters:\n");
    for (int i = 0; i < numCharacters; i++) {
        printf("%s\n", characters[i].name);
    }
}

void viewOptions(Option options[], int numOptions) {
    printf("Options:\n");
    for (int i = 0; i < numOptions; i++) {
        printf("%s\n", options[i].option);
    }
}

void play(Scene scenes[], int numScenes, Character characters[], int numCharacters, Option options[], int numOptions) {
    for (int i = 0; i < numScenes; i++) {
        printf("%s\n", scenes[i].content);
        if (i < numOptions) {
            printf("Options:\n");
            for (int j = 0; j < numOptions; j++) {
                printf("%d. %s\n", j + 1, options[j].option);
            }
            int choice;
            printf("Enter your choice: ");
            scanf("%d", &choice);
            getchar();
        }
    }
}

int main() {
    Scene scenes[MAX_SCENES];
    Character characters[MAX_CHARACTERS];
    Option options[MAX_OPTIONS];
    int numScenes = 0;
    int numCharacters = 0;
    int numOptions = 0;

    while (1) {
        displayMenu();
        int choice;
        printf("Enter your choice: ");
        scanf("%d", &choice);
        getchar();

        switch (choice) {
            case 1:
                addScene(scenes, &numScenes);
                break;
            case 2:
                addCharacter(characters, &numCharacters);
                break;
            case 3:
                addOption(options, &numOptions);
                break;
            case 4:
                viewScenes(scenes, numScenes);
                break;
            case 5:
                viewCharacters(characters, numCharacters);
                break;
            case 6:
                viewOptions(options, numOptions);
                break;
            case 7:
                play(scenes, numScenes, characters, numCharacters, options, numOptions);
                break;
            case 8:
                printf("Goodbye!\n");
                return 0;
            default:
                printf("Invalid choice!\n");
        }
    }

    return 0;
}
