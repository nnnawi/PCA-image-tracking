if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
  } else {
    ready();
  }

function ready(){
    create_collapsable();
    var apply_matrix_wrapper = document.getElementById("apply_matrix_wrapper");
    var apply_matrix_arrow_wrapper = document.getElementById("apply_matrix_arrow_wrapper");
    var apply_button_1 = apply_matrix_wrapper.getElementsByClassName("apply")[0];
    apply_button_1.addEventListener("click",function(){
        apply_matrix_boolean = true;
    });
    var apply_button_2 = apply_matrix_arrow_wrapper.getElementsByClassName("apply")[0];
    apply_button_2.addEventListener("click",function(){
        apply_matrix_arrow_boolean = true;
    })
    var reset_button_1 = apply_matrix_wrapper.getElementsByClassName("reset")[0];
    reset_button_1.addEventListener("click",function(){
        reset_matrix_boolean = true;
    });
    var reset_button_2 = apply_matrix_arrow_wrapper.getElementsByClassName("reset")[0];
    reset_button_2.addEventListener("click",function(){
        reset_matrix_arrow_boolean = true;
    })
}

function create_collapsable(){
    var collapsable_buttons = document.getElementsByClassName("collapsible");
    for(i = 0;i < collapsable_buttons.length;i++){
        var current_button = collapsable_buttons[i];
        current_button.addEventListener('click',function(){
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if(content.style.display === "block"){
                content.style.display= "none";
            }
            else{
                content.style.display = "block";
            }
        });
    }
}