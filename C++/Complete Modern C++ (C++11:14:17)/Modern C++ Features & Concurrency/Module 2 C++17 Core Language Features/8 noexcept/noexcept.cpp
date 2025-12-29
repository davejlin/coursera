void Foo() noexcept{
}
void Bar(){
}

int main(){
	// void (*p) ();
    // p = Bar ;
	
    // void (*p) () noexcept; // cannot work with a function without noexcept
    void (*p) (); // can work with a function with noexcept
    p = Foo ;
	
    p() ;
}