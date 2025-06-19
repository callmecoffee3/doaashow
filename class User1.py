class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

class SocialMedia:
    def __init__(self):
        self.users = []
        self.posts = []

    def main_menu(self):
        print("\nMain Menu:")
        print("1. Main Feed")
        print("2. Discover")
        print("3. Trending")
        print("4. Groups")
        print("5. Profiles")
        print("6. Pages")
        print("7. Create Post")
        print("8. Exit")

    def main_feed(self):
        print("\nMain Feed:")
        for post in self.posts:
            print(post)

    def discover(self):
        print("\nDiscover:")
        print("New content here")

    def trending(self):
        print("\nTrending:")
        print("Trending topics here")

    def groups(self):
        print("\nGroups:")
        print("Groups here")

    def profiles(self):
        print("\nProfiles:")
        for user in self.users:
            print(user.name)

    def pages(self):
        print("\nPages:")
        print("Pages here")

    def create_post(self, user):
        post_content = input("Enter your post content: ")
        self.posts.append(f"{user.name}: {post_content}")
        print("Post created successfully!")

def main():
    social_media = SocialMedia()
    user_name = input("Enter your name: ")
    user_email = input("Enter your email: ")
    user = User(user_name, user_email)
    social_media.users.append(user)

    while True:
        social_media.main_menu()
        user_input = input("Enter your choice: ")
        
        if user_input == "1":
            social_media.main_feed()
        elif user_input == "2":
            social_media.discover()
        elif user_input == "3":
            social_media.trending()
        elif user_input == "4":
            social_media.groups()
        elif user_input == "5":
            social_media.profiles()
        elif user_input == "6":
            social_media.pages()
        elif user_input == "7":
            social_media.create_post(user)
        elif user_input == "8":
            print("Goodbye!")
            break

if __name__ == "__main__":
    main()