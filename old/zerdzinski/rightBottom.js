// $('.bottom').on('click', '.bottomDiv', function () {
//     if (!$('.bottomDiv').hasClass('hidden')) {
//         $(document).on('click', '.bottomDiv', function () {

//             if (!$(this).hasClass('bottomMax')) {
//                 $('.bottomDiv').addClass('hidden');
//                 $(this).append('<div class="back"></div>');
//                 $(this).removeClass('hidden');
//                 $(this).addClass('bottomMax');
//                 $(this).css('height', 'calc(100% - 20px)');

//                 console.log('3');
//             }

//             console.log('1');


// return 0;


//         });

//     }
//     if (!$('.bottomMax').hasClass('hidden')) {
//         $('.back').on('mouseenter', function () {
//             $(document).on('click', '.bottomDiv', function () {
//                 $('.bottomDiv').removeClass('hidden');
//                 $('.bottomDiv').removeClass('bottomMax');
//                 $(this).css('height', '303.5px');    //nie wiem skad akurat 303.5px XD

//                 $('.back').remove();
//                 console.log('2');


//                 document.querySelector('.bottom').style.overflowY = 'hidden';
//                 setTimeout(() => {
//                     document.querySelector('.bottom').style.overflowY = 'auto';
//                 }, 2000);
//             });
//         })
//         return 0;
//     }
//     return 0;
// });

// var iconBack = "<div class='back'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-left" viewBox="0 0 16 16">
// <path fill-rule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5z"/>
// </svg></div>"

$('.bottom').on('click', '.bottomDiv', function () {
    if (!$(this).hasClass('.bottomMax')) {
        $(this).addClass('bottomMax');
        $('.bottomDiv').addClass('hidden');
        $(this).removeClass('hidden');
        $(this).append("<div class='back'><i class='bi bi-arrow-bar-left'></i></div>");
        $(this).css('height', 'calc(100% - 20px)');
    }
})

$('.bottom').on('mouseenter', '.back', function () {
    $(this).on('click', function () {
        $('.bottomDiv').removeClass('hidden');

        $('.bottomMax').css('height', '303.5px');    //nie wiem skad akurat 303.5px XD
        $('.bottomDiv').removeClass('bottomMax');
        $('.back').remove();


        document.querySelector('.bottom').style.overflowY = 'hidden';
        setTimeout(() => {
            document.querySelector('.bottom').style.overflowY = 'auto';
        }, 2000);
    })
})




const currentDate = new Date();

const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

document.querySelector('#data').innerText = currentDate.toLocaleDateString('pl-PL', options);