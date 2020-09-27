#ifndef __INPUT_H__
#define __INPUT_H__
#include <stdlib.h>
#include <stdio.h>

struct data_t {
	char ** lines;
	size_t numberOfLines;
};
typedef struct data_t Data;

Data * getData(const char * fname);
void freeData(Data * data);

#endif
