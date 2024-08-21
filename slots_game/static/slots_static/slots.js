const SLOTS_PER_REEL = 10;
// radius = Math.round( ( panelWidth / 2) / Math.tan( Math.PI / SLOTS_PER_REEL ) ); 
// current settings give a value of 149, rounded to 150
const REEL_RADIUS = 120;


function createSlots (ring) {
	
	var slotAngle = 360 / SLOTS_PER_REEL;

	// var seed = getSeed();

	for (var i = 0; i < SLOTS_PER_REEL; i ++) {
		var slot = document.createElement('div');
		var seed = i
		slot.className = 'slot';

		// compute and assign the transform for this slot
		var transform = 'rotateX(' + (slotAngle * i) + 'deg) translateZ(' + REEL_RADIUS + 'px)';

		slot.style.transform = transform;

		// setup the number to show inside the slots
		// the position is randomized to 
		if (seed != 7){
			var content = $(slot).append('<p class="num">' + (seed)+ '</p>');
		}
		else {
			var content = $(slot).append('<p class="num-7">7</p>');
		}
		

		// add the poster to the row
		ring.append(slot);
	}
}


async function prize_game(){
	let count_of_prize_spins = 7;
	$('.win-text').text("Призова гра");
	$('.win-message').css("opacity", "");
	$('.greeting-message').text("Призові спроби: " + count_of_prize_spins)
	$('.greeting-message').css("opacity", "");
	$('.go').css("opacity", "0");
	$('.go').prop("disabled", true)
	while(count_of_prize_spins != 0) {
		let seeds = [];
		for(var j = 1; j < 4; j ++) {
			var seed = getSeed();
			seeds.push(seed);
			$('#ring'+j)
				.css('animation','back-spin 1s, spin-' + seed + ' ' + (2 + j*0.5) + 's')
				.attr('class','ring spin-' + seed);
		}
		await new Promise(resolve => setTimeout(resolve, 4000));
		console.log(count_of_prize_spins);
		count_of_prize_spins -= 1;
		$('.greeting-message').css("opacity", "0");
		$('.greeting-message').text("Призові спроби: " + count_of_prize_spins)
		$('.greeting-message').css("opacity", "");
		// seeds = seeds.join('');
		if(seeds.filter(x => x === '7').length === 2) {
			count_of_prize_spins += 7;
			$('.greeting-message').css("opacity", "0");
			$('.greeting-message').text("Призові спроби: " + count_of_prize_spins)
			$('.greeting-message').css("opacity", "");
		}
		else if(new Set(seeds).length === 1) {
			count_of_prize_spins += 7;
			$('.greeting-message').css("opacity", "0");
			$('.greeting-message').text("Призові спроби: " + count_of_prize_spins)
			$('.greeting-message').css("opacity", "");
		}
		else if (seeds.includes('7') && (seeds[0] === seeds[1] || seeds[1] === seeds[2] || seeds[2] === seeds[0])) {
			count_of_prize_spins += 7;
			$('.greeting-message').css("opacity", "0");
			$('.greeting-message').text("Призові спроби: " + count_of_prize_spins)
			$('.greeting-message').css("opacity", "");
		}
		else {
			console.log("not match")
		}
		setTimeout(4000);
	}
	$('.go').css("opacity", "");
	$('.go').prop("disabled", false)
}


function getSeed() {
	// generate random number smaller than 13 then floor it to settle between 0 and 9 inclusive'
	var seed = NaN;
	$.ajax({
		type: 'GET',
		url: 'slots_game/',
		async: false,
		success: function (response) {
			seed = response;
		}
	});
	return seed;
}

function spin(timer) {
	$('.greeting-message').css("opacity", "0");
	$('.win-message').css("opacity", "0");
	let count_spins = $('.count').text();
	console.log(count_spins);
	if(count_spins > 0){
		let seeds = [];
		for(var i = 1; i < 4; i ++) {
			// var oldSeed = -1;
			/*
			checking that the old seed from the previous iteration is not the same as the current iteration;
			if this happens then the reel will not spin at all
			*/
			// var oldClass = $('#ring'+i).attr('class');
			// if(oldClass.length > 4) {
			// 	oldSeed = parseInt(oldClass.slice(10));
			// 	// console.log("oldseed: " + oldSeed);
			// }
			
			var seed = getSeed();
			// var seed = 7;
			seeds.push(seed);
			// while(oldSeed == seed) {
			// 	seed = getSeed();
			// }
			// var seed = 0;
			// console.log('seed:' + seed)
			$('#ring'+i)
				.css('animation','back-spin 1s, spin-' + seed + ' ' + (timer + i*0.5) + 's')
				.attr('class','ring spin-' + seed);
		}
		count_spins -= 1;
		$('.count').text(count_spins);
		seeds = seeds.join('');
		if(seeds == '777'){
			console.log("WIN!!! Main gift");
			$('.win-text').text("головний приз");
			setTimeout(function () {
				$('.win-message').css("opacity", "");
			}, 4000);
			setTimeout(function () {
				$('.win-message-container').css("opacity", "0");
				$('#stage').css("opacity", "0");
				$('.win-window').show();
			}, 5500);
		}
		else if(seeds == '444' || seeds == '744' || seeds == '774' || seeds == '477' || seeds == '447') {
			console.log("You get super game with 7 spins");
			let count_of_prize_spins = 7;
			// loopWithDelay(count_of_prize_spins);
			prize_game();
			// for(var i = 0; i < count_of_prize_spins; i ++) {
				
			// }
				

		}
		else if(seeds.includes('7')) {
			console.log("You get a 2 free spins");
			count_spins += 2;
			console.log(count_spins);
			
			$('.win-text').text("2 спроби");
			setTimeout(function () {
				$('.count').text(count_spins);
				$('.win-message').css("opacity", "");
			}, 4000);
		}
	}
	else {
		alert("You have no more spins left!");
	}
	//var txt = 'seeds: ';
	

	console.log('=====');
}

async function loopWithDelay(count_of_prize_spins) {
	for (var i = 0; i < count_of_prize_spins; i++) {
	  await new Promise(resolve => setTimeout(resolve, 4000));
	  console.log("prize game" + i);
	  // do something else here
	}
  }




$(document).ready(function() {
	$('.win-window').hide();
	$('.win-message').css("opacity", "0");
	$('.count').text('50');
	// initiate slots 
 	createSlots($('#ring1'));
 	createSlots($('#ring2'));
 	createSlots($('#ring3'));

 	// hook start button
 	$('.go').on('click',function(){
 		var timer = 2;
 		spin(timer);
 	})

 	// hook xray checkbox
 	$('#xray').on('click',function(){
 		//var isChecked = $('#xray:checked');
 		var tilt = 'tiltout';
 		
    if($(this).is(':checked')) {
 			tilt = 'tiltin';
 			$('.slot').addClass('backface-on');
 			// $('#rotate').css('animation',tilt + ' 2s 1');

			// setTimeout(function(){
			//   $('#rotate').toggleClass('tilted');
			// },2000);
 		} else {
      tilt = 'tiltout';
      $('.slot').removeClass('backface-on');
 			// $('#rotate').css({'animation':tilt + ' 2s 1'});

			// setTimeout(function(){
	 		// 	$('#rotate').toggleClass('tilted');
	 		// 	$('.slot').removeClass('backface-on');
	 		// },1900);
 		}
 	})

	 $('#close-btn').on('click', function () {
		$('.win-window').hide();
		$('.win-message-container').css("opacity", "");
		$('#stage').css("opacity", "");
	})

 	// hook perspective
 	$('#perspective').on('click',function(){
 		$('#stage').toggleClass('perspective-on perspective-off');
 	})	
 });