$(document).ready(function() {
	
	/**
	 * --------------------------------------------------------------------------------------------
	 * Side navigation
	 * --------------------------------------------------------------------------------------------
	 */	

	$('#sidebar').addClass('col-md-2 col-xs-8');
   toggleSideNav();

	/**
	 * Toggle side navigation between maximized and minimized state. 
	 */
	function toggleSideNav() {
		// Toggle: Width of the column <--> min-width
		$('#sidebar').toggleClass('col-md-2 col-xs-8 d-none d-md-block');

		// Toggle the display of link text element
		$('#sidebar span.nav-link-text').toggle();

		// Toggle: The show class in the div holding sub links
		$('#sidebar li.nav-item div').removeClass('show');

		return false;
	}	

	/**
	 * Toggle side nav when an element (3 lines icon) is clicked
	 */
	$('#sidebar-toggle').click(toggleSideNav);

	/**
	 * A link is clicked. Could be in maximized state or in minimized state.
	 */
	$('#sidebar a.nav-link').click(function(e) {

		// If col-md-2 is absent it means side-nav is minimized.
		if (!$('#sidebar').hasClass('col-md-2')) {
			toggleSideNav();
		}

		// Add active class to the link clicked.
		$('#sidebar a.nav-link').removeClass('active');
		var $this = $(this);
		if (!$this.hasClass('active')) {
			$this.addClass('active');
		}
	});
	
	function slugify (str) {
	    var slug = '';
	    var trimmed = $.trim(str);
	    slug = trimmed
	    	.replace(/[^a-z0-9-]/gi, '-')
	    	.replace(/-+/g, '-')
	    	.replace(/^-|-$/g, '');
	    return $slug.toLowerCase();
	}	

});
