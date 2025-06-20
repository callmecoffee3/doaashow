#include <stdio.h>
#include <string.h>

#define MAX_POSTS 100
#define MAX_MESSAGES 100
#define MAX_GROUPS 10
#define MAX_PAGES 10
#define MAX_PRODUCTS 10
#define MAX_NAME_LENGTH 50
#define MAX_CONTENT_LENGTH 200

struct Post {
    char content[MAX_CONTENT_LENGTH];
    int likes;
};

struct SocialMedia {
    struct Post posts[MAX_POSTS];
    char messages[MAX_MESSAGES][MAX_CONTENT_LENGTH];
    char groups[MAX_GROUPS][MAX_NAME_LENGTH];
    char pages[MAX_PAGES][MAX_NAME_LENGTH];
    char products[MAX_PRODUCTS][MAX_NAME_LENGTH];
    char profile[MAX_NAME_LENGTH];
    int num_posts;
    int num_messages;
    int num_groups;
    int num_pages;
    int num_products;
};

void mainMenu() {
    printf("Main Menu:\n");
    printf("1. Main Feed\n");
    printf("2. Create Post\n");
    printf("3. Messages\n");
    printf("4. Trending\n");
    printf("5. Groups\n");
    printf("6. Profile\n");
    printf("7. Pages\n");
    printf("8. Shop\n");
    printf("9. Help\n");
    printf("10. Exit\n");
}

void mainFeed(struct SocialMedia *socialMedia) {
    printf("\nMain Feed:\n");
    for (int i = 0; i < socialMedia->num_posts; i++) {
        printf("%s (%d likes)\n", socialMedia->posts[i].content, socialMedia->posts[i].likes);
    }
}

void createPost(struct SocialMedia *socialMedia) {
    printf("Enter your post content: ");
    fgets(socialMedia->posts[socialMedia->num_posts].content, MAX_CONTENT_LENGTH, stdin);
    socialMedia->posts[socialMedia->num_posts].content[strcspn(socialMedia->posts[socialMedia->num_posts].content, "\n")] = 0;
    socialMedia->posts[socialMedia->num_posts].likes = 0;
    socialMedia->num_posts++;
    printf("Post created successfully!\n");
}

void trending(struct SocialMedia *socialMedia) {
    printf("\nTrending Posts:\n");
    for (int i = 0; i < socialMedia->num_posts; i++) {
        if (socialMedia->posts[i].likes > 5) {
            printf("%s (%d likes)\n", socialMedia->posts[i].content, socialMedia->posts[i].likes);
        }
    }
}

void profile(struct SocialMedia *socialMedia) {
    printf("\nProfile:\n");
    printf("Name: %s\n", socialMedia->profile);
}

void pages(struct SocialMedia *socialMedia) {
    printf("\nPages:\n");
    for (int i = 0; i < socialMedia->num_pages; i++) {
        printf("%s\n", socialMedia->pages[i]);
    }
}

void shop(struct SocialMedia *socialMedia) {
    printf("\nShop:\n");
    for (int i = 0; i < socialMedia->num_products; i++) {
        printf("%s\n", socialMedia->products[i]);
    }
}

void help() {
    printf("Help Menu:\n");
    printf("This is a social media platform where you can create posts and send messages.\n");
    printf("You can view your main feed to see all the posts you've created.\n");
    printf("You can also view your messages to see all the messages you've sent.\n");
}

int main() {
    struct SocialMedia socialMedia;
    socialMedia.num_posts = 0;
    socialMedia.num_messages = 0;
    socialMedia.num_groups = 0;
    socialMedia.num_pages = 0;
    socialMedia.num_products = 0;

    printf("Enter your name: ");
    fgets(socialMedia.profile, MAX_NAME_LENGTH, stdin);
    socialMedia.profile[strcspn(socialMedia.profile, "\n")] = 0;

    while (1) {
        mainMenu();
        int choice;
        printf("Enter your choice: ");
        scanf("%d", &choice);
        getchar();

        switch (choice) {
            case 1:
                mainFeed(&socialMedia);
                break;
            case 2:
                createPost(&socialMedia);
                break;
            case 3:
                printf("Messages:\n");
                for (int i = 0; i < socialMedia.num_messages; i++) {
                    printf("%s\n", socialMedia.messages[i]);
                }
                break;
            case 4:
                trending(&socialMedia);
                break;
            case 5:
                printf("Groups:\n");
                for (int i = 0; i < socialMedia.num_groups; i++) {
                    printf("%s\n", socialMedia.groups[i]);
                }