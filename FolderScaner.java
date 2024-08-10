import java.io.file;

public class FolderScanner
{
public static void
main(string[] agrs) {
File fDrive = new
File("F:\\")

scanFloders( fDrive);
}
public ststic viod
scanFolders(File dir){
File[] files =
for (File
file : files) {
if
(file.isDirrectory()) {
System.out.println("Folder: " +
file.getAbsolutePath()));
scanFolders(files);
}else{
System.out.println("File:
file.getAbsolutePath())"}
}
}
}