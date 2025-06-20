#include <stdio.h>
#include <string.h>

#define MAX_POSTS 100
#define MAX_MESSAGES 100
#define MAX_USERS 10
#define MAX_NAME_LENGTH 50
#define MAX_CONTENT_LENGTH 200

typedef struct message {
    char content[MAX_CONTENT_LENGTH];
};

struct post {
    char content[MAX_CONTENT_LENGTH];
};

struct user {
    char name[MAX_NAME_LENGTH];
};

struct social_media {
    struct user users[MAX_USERS];
    struct post posts[MAX_POSTS];
    struct message messages[MAX_MESSAGES];
    int num_users;
    int num_posts;
    int num_messages;
};
===========================
void main_menu() {
    =============================
    printf("\nMain Menu:\n");
    printf("1. Main Feed\n");
    printf("2. Discover\n");
    printf("3. Trending\n");
    printf("4. Groups\n");
    printf("5. Profiles\n");
    printf("6. Pages\n");
    printf("7. Create Post\n");
    printf("8. Messages\n");
    printf("9. Exit\n");
    ===============================
}

void main_feed(struct social_media *social_media) {
    printf("\nMain Feed:\n");
    for (int i = 0; i < social_media->num_posts; i++) {
        printf("%s\n", social_media->posts[i].content);
    }
}

void create_post(struct social_media *social_media) {
    if (social_media->num_posts < MAX_POSTS) {
        printf("Enter your post content: ");
        fgets(social_media->posts[social_media->num_posts].content, MAX_CONTENT_LENGTH, stdin);
        social_media->posts[social_media->num_posts].content[strcspn(social_media->posts[social_media->num_posts].content, "\n")] = 0;
        social_media->num_posts++;
        printf("Post created successfully!\n");
    } else {
        printf("Maximum number of posts reached!\n");
    }
}

void send_message(struct social_media *social_media) {
    if (social_media->num_messages < MAX_MESSAGES) {
        printf("Enter your message: ");
        fgets(social_media->messages[social_media->num_messages].content, MAX_CONTENT_LENGTH, stdin);
        social_media->messages[social_media->num_messages].content[strcspn(social_media->messages[social_media->num_messages].content, "\n")] = 0;
        social_media->num_messages++;
        printf("Message sent successfully!\n");
    } else {
        printf("Maximum number of messages reached!\n");
    }
}

void view_messages(struct social_media *social_media) {
    printf("\nMessages:\n");
    for (int i = 0; i < social_media->num_messages; i++) {
        printf("%s\n", social_media->messages[i].content);
    }
}

int main() {
    struct social_media social_media;
    social_media.num_users = 0;
    social_media.num_posts = 0;
    social_media.num_messages = 0;

    printf("Enter your name: ");
    fgets(social_media.users[social_media.num_users].name, MAX_NAME_LENGTH, stdin);
    social_media.users[social_media.num_users].name[strcspn(social_media.users[social_media.num_users].name, "\n")] = 0;
    social_media.num_users++;

    while (1) {
        main_menu();
        int choice;
        printf("Enter your choice: ");
        scanf("%d", &choice);
        getchar();

        switch (choice) {
            case 1:
                main_feed(&social_media);
                break;
            case 2:
                printf("Discover\n");
                break;
            case 3:
                printf("Trending\n");
                break;
            case 4:
                printf("Groups\n");
                break;
            case 5:
                printf("Profiles\n");
                break;
            case 6:
                printf("Pages\n");
                break;
            case 7:
                create_post(&social_media);
                break;
            case 8:
                printf("Messages:\n");
                printf("1. Send Message\n");
                printf("2. View Messages\n");
                int message_choice;
                printf("Enter your choice: ");
                scanf("%d", &message_choice);
                getchar();

                switch (message_choice) {
                    case 1:
                        send_message(&social_media);
                        break;
                    case 2:
                        view_messages(&social_media);
                        break;
                    default:
                        printf("Invalid choice!\n");
                }
                break;
            case 9:
                printf("Goodbye!\n");
                return 0;
            default:
                printf("Invalid choice!\n");
        }
    }

    return 0;
}