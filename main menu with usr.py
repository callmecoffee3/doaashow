def main_feed():
    print("\nMain Feed:")
    print("Here are some latest posts:")
    print("1. Post 1 - This is a sample post")
    print("2. Post 2 - This is another sample post")
    print("3. Post 3 - This is yet another sample post")

def main_menu():
    print("\nMain Menu:")
    print("1. Main Feed")
    print("2. Create - Write a new post or create content")
    print("3. Discover - Explore latest posts and content")
    print("4. DoaShow - Develop a new TV show concept")
    print("5. Notifications - Check your notifications")
    print("6. Profile - View your profile")
    print("7. Settings - Configure your settings")
    print("8. Help - Display help and instructions")
    print("9. Games - Play games and have fun!")
    print("10. Exit")

def main():
    while True:
        main_menu()
        user_input = input("Enter your choice: ")
        
        if user_input == "1":
            main_feed()
            post_input = input("Enter the number of the post you'd like to view: ")
            if post_input == "1":
                print("\nPost 1 - This is a sample post")
                print("This is a sample post. You can view comments and likes here.")
            elif post_input == "2":
                print("\nPost 2 - This is another sample post")
                print("This is another sample post. You can view comments and likes here.")
            elif post_input == "3":
                print("\nPost 3 - This is yet another sample post")
                print("This is yet another sample post. You can view comments and likes here.")
        elif user_input == "2":
            print("\nCreate - Write a new post or create content")
            post_content = input("Enter your post content: ")
            print("Your post has been created successfully!")
        elif user_input == "3":
            print("\nDiscover - Explore latest posts and content")
            print("Here are some latest posts:")
            print("1. Post 1")
            print("2. Post 2")
            print("3. Post 3")
        elif user_input == "4":
            print("\nDoaShow - Develop a new TV show concept")
            show_name = input("Enter your TV show name: ")
            print("Your TV show concept has been submitted successfully!")
        elif user_input == "5":
            print("\nNotifications - Check your notifications")
            print("You have 5 new notifications.")
        elif user_input == "6":
            print("\nProfile - View your profile")
            print("Your profile information:")
            print("Name: John Doe")
            print("Email: johndoe@example.com")
        elif user_input == "7":
            print("\nSettings - Configure your settings")
            print("1. Change password")
            print("2. Change email")
            settings_input = input("Enter your choice: ")
            if settings_input == "1":
                print("Change password")
                new_password = input("Enter your new password: ")
                print("Your password has been changed successfully!")
            elif settings_input == "2":
                print("Change email")
                new_email = input("Enter your new email: ")
                print("Your email has been changed successfully!")
        elif user_input == "8":
            print("\nHelp - Display help and instructions")
            print("Here are some help and instructions:")
            print("1. How to create a post")
            print("2. How to view your profile")
        elif user_input == "9":
            print("\nGames - Play games and have fun!")
            print("Here are some games you can play:")
            print("1. Game 1")
            print("2. Game 2")
        elif user_input == "10":
            print("\nGoodbye!")
            break
        else:
            print("\nInvalid choice. Please try again.")

if __name__ == "__main__":
    main()