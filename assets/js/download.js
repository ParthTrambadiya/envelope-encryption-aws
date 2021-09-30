if(window.location.pathname == '/download') {
    $ondownload = $('.table tbody td button.download')
    $ondownload.click(function() {
        swal({
            title: "Success",
            text: "Please wait, we are downloading your file from S3 Bucket and decrypting your file.",
            icon: "success",
            closeOnClickOutside: false,
            closeOnEsc: false,
            buttons: false
        });
        
        var fileId = $(this).attr('data-id')

        var request = {
            'url': `/download/api/${fileId}`,
            'method': 'GET'
        }
        $.ajax(request).done(function(response) {
            let file = new Uint8Array(response.file.data);
            let blob = new Blob([file]);
            let url = URL.createObjectURL(blob);
            let link = document.createElement('a');
            link.download = response.fileName;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
            swal.close()
        })
    })
}