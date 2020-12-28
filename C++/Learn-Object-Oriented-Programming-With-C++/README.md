#Learn Object Oriented Programming With C++ Guided Project

##To debug with console input:

1.  In launch.json, set:
        "externalConsole": true,

2. Add the following taks to tasts.json:
		{
			"label": "Open Terminal",
			"type": "shell",
			"command": "osascript -e 'tell application \"Terminal\"\ndo script \"echo hello\"\nend tell'",
			"problemMatcher": []
		}

3. Run this specific task: 
    a. Command + Shift + p. 
    b. Type Tasks 
    c. Look for Tasks: Run Tasks
    d. Select Open Terminal

4. Once you allow this permission, then the external console should appear when you debug.

Ref: https://github.com/microsoft/vscode-cpptools/issues/5079#issuecomment-626090192